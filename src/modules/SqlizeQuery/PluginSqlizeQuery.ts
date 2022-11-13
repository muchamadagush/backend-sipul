/* eslint-disable no-unused-vars */
import { cloneDeep, unset } from 'lodash'
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns'
import { Op, ModelCtor, Includeable, IncludeOptions } from 'sequelize'

import {
  getPrimitiveDataType,
  transfromIncludeToQueryable,
} from './SqlizeQuery'
import SqlizeQuery from './index'

const WhereFilterOP: { [key: string]: symbol | 'betweenYearMonth' } = {
  // basic
  eq: Op.eq,
  ne: Op.ne,
  is: Op.is,
  not: Op.not,
  // or: Op.or,
  // comparison
  gt: Op.gt,
  gte: Op.gte,
  lt: Op.lt,
  lte: Op.lte,
  between: Op.between,
  betweenYearMonth: 'betweenYearMonth',
  notBetween: Op.notBetween,
  // other
  in: Op.in,
  notIn: Op.notIn,
  like: Op.like,
  notLike: Op.notLike,
  startsWith: Op.startsWith,
  endsWith: Op.endsWith,
  substring: Op.substring,
}

const parserString = (value: any) => {
  return typeof value === 'string' ? JSON.parse(value) : value || []
}

function getExactQueryIdModel(id: string, prefixName: any) {
  if (id === undefined) {
    return undefined
  }
  const splitId = id.split('.')
  if (!prefixName && splitId.length > 1) {
    return undefined
  }
  const indexId = splitId.findIndex((str) => str === prefixName)
  if (prefixName && indexId < 0) {
    return undefined
  }

  const curId = prefixName
    ? splitId
        .filter((str, index) => {
          return [indexId, indexId + 1].includes(index)
        })
        .pop()
    : id

  if (!curId || (prefixName && splitId.indexOf(curId) !== splitId.length - 1)) {
    return undefined
  }

  return curId
}

function getFilteredQuery(model?: ModelCtor<any>, prefixName?: string) {
  const sequelizeQuery = new SqlizeQuery()
  sequelizeQuery.addValueParser(parserString)
  sequelizeQuery.addQueryBuilder(
    (filterData: { id: string; value: any }, queryHelper) => {
      // eslint-disable-next-line prefer-const
      let { id, value } = filterData || {}
      let optQuery = WhereFilterOP.substring
      const isIncludeSymbol = id?.includes('$')
      if (isIncludeSymbol) {
        const [optId, fieldId] = id.split('$')
        id = fieldId
        optQuery = WhereFilterOP[optId]
      }

      const curId = getExactQueryIdModel(id, prefixName)
      if (!curId) {
        return
      }

      const primitiveDataType = getPrimitiveDataType(
        model?.rawAttributes?.[curId]?.type
      )
      const type =
        primitiveDataType === 'date' ? 'date' : typeof primitiveDataType
      if ((type === 'boolean' || type === 'number') && !isIncludeSymbol) {
        queryHelper.setQuery(curId, value)
      } else if (type === 'date') {
        if (
          optQuery === WhereFilterOP.betweenYearMonth &&
          Array.isArray(value)
        ) {
          const valStartMonth = startOfMonth(new Date(value[0]))
          const valEndMonth = endOfMonth(new Date(value[1]))
          queryHelper.setQuery(curId, {
            [Op.between]: [valStartMonth, valEndMonth],
          })
          return
        }

        const startDay = startOfDay(new Date(value))
        const endDay = endOfDay(new Date(value))
        if (
          (optQuery === WhereFilterOP.notBetween ||
            optQuery === WhereFilterOP.between) &&
          Array.isArray(value)
        ) {
          const valStartDay = startOfDay(new Date(value[0]))
          const valEndDay = endOfDay(new Date(value[1]))
          queryHelper.setQuery(curId, {
            [optQuery]: [valStartDay, valEndDay],
          })
        } else if (optQuery === WhereFilterOP.lte) {
          queryHelper.setQuery(curId, {
            [optQuery]: endDay,
          })
        } else if (optQuery === WhereFilterOP.lt) {
          queryHelper.setQuery(curId, {
            [optQuery]: startDay,
          })
        } else if (optQuery === WhereFilterOP.gte) {
          queryHelper.setQuery(curId, {
            [optQuery]: startDay,
          })
        } else if (optQuery === WhereFilterOP.gt) {
          queryHelper.setQuery(curId, {
            [optQuery]: endDay,
          })
        } else {
          queryHelper.setQuery(curId, {
            [WhereFilterOP.between]: [startDay, endDay],
          })
        }
      } else {
        //! isIncludeSymbol || optQuery === WhereFilterOP.eq, etc
        queryHelper.setQuery(curId, {
          [optQuery]: value,
        })
      }
    }
  )
  return sequelizeQuery
}

function getSortedQuery() {
  const sequelizeQuery = new SqlizeQuery()
  sequelizeQuery.addValueParser(parserString)
  sequelizeQuery.addQueryBuilder((value, queryHelper) => {
    if (value?.id) {
      queryHelper.setQuery(value.id, value.desc === true ? 'DESC' : 'ASC')
    }
  })
  sequelizeQuery.addTransformBuild((buildValue, transformHelper) => {
    transformHelper.setValue(
      Object.entries(buildValue).map(([id, value]) => {
        return [...id.split('.'), value]
      })
    )
  })
  return sequelizeQuery
}

function getPaginationQuery() {
  const sequelizeQuery = new SqlizeQuery()
  const offsetId = 'page'
  const limitId = 'pageSize'
  const defaultOffset = 0
  const defaultLimit = 10
  const maxLimit = 50

  sequelizeQuery.addValueParser((value) => {
    const { page, withMaxLimit = 1 } = value
    let { pageSize } = value

    if (Number(withMaxLimit)) {
      if (Number(pageSize) > maxLimit) pageSize = maxLimit
    }

    return [
      {
        id: offsetId,
        value: Number(page),
      },
      {
        id: limitId,
        value: Number(pageSize),
      },
    ]
  })

  sequelizeQuery.addQueryBuilder(({ id, value }, queryHelper) => {
    if (id === offsetId) {
      const offsetValue = queryHelper.getDataValueById(limitId) * (value - 1)
      queryHelper.setQuery(
        'offset',
        offsetValue > 0 ? offsetValue : defaultOffset
      )
    }
    if (id === limitId) {
      queryHelper.setQuery('limit', value || defaultLimit)
    }
  })

  return sequelizeQuery
}

function getIncludeFilteredQuery(
  filteredValue: any,
  model: any,
  prefixName: any,
  options?: IncludeOptions
) {
  const where = getFilteredQuery(model, prefixName).build(filteredValue)

  let extraProps = {}

  if (Object.keys(where).length > 0) {
    extraProps = {
      ...extraProps,
      where,
      required: true,
    }
  }

  return {
    model,
    ...extraProps,
    ...options,
  }
}

function filterIncludeHandledOnly({
  include,
  filteredInclude,
}: {
  include: any
  filteredInclude?: any
}) {
  const curFilteredInclude = filteredInclude || []
  if (include) {
    for (let i = 0; i < include.length; i += 1) {
      const curModel = include[i]
      let childIncludes = []
      if (curModel.include) {
        childIncludes = filterIncludeHandledOnly({
          include: curModel.include,
        })
      }

      if (curModel.where || curModel.required || childIncludes.length > 0) {
        const clonedInclude = cloneDeep(curModel)
        unset(clonedInclude, 'include')
        if (childIncludes.length > 0) {
          clonedInclude.include = [...childIncludes]
        }
        curFilteredInclude.push(clonedInclude)
      }
    }
  }
  return curFilteredInclude
}

function injectRequireInclude(include: Includeable[]) {
  function test(dataInclude: Includeable[]) {
    for (let i = 0; i < (dataInclude?.length || 0); i += 1) {
      const optionInclude = dataInclude[i] as IncludeOptions
      let data
      if (optionInclude.include) {
        data = test(optionInclude.include)
      }

      if (optionInclude.required) return true
      if (data && optionInclude.required === undefined) {
        optionInclude.required = true
        return true
      }
    }
    return false
  }

  test(include)

  return include
}

function makeIncludeQueryable(filteredValue: any, includes: Includeable[]) {
  return transfromIncludeToQueryable(includes, (value) => {
    const { model, as, key, ...restValue } = value
    return getIncludeFilteredQuery(filteredValue, model, as || key, {
      key,
      as,
      ...restValue,
    } as IncludeOptions)
  })
}

interface OnBeforeBuildQuery {
  paginationQuery: SqlizeQuery
  filteredQuery: SqlizeQuery
  sortedQuery: SqlizeQuery
}

interface GenerateOptions {
  onBeforeBuild: (query: OnBeforeBuildQuery) => void
}

interface ReqGenerate {
  filtered?: { id: any; value: any }[]
  sorted?: { id: any; desc: boolean }[]
  page?: number
  pageSize?: number
  [key: string]: any
}

function generate(
  reqQuery: ReqGenerate,
  model: any,
  includeRule?: Includeable | Includeable[],
  options?: GenerateOptions
) {
  const { onBeforeBuild } = options || {}

  const paginationQuery = getPaginationQuery()
  const filteredQuery = getFilteredQuery(model)
  const sortedQuery = getSortedQuery()
  const includeCountRule = filterIncludeHandledOnly({
    include: includeRule,
  })
  const include = injectRequireInclude(cloneDeep(includeRule) as Includeable[])
  const includeCount = injectRequireInclude(
    cloneDeep(includeCountRule) as Includeable[]
  )

  if (onBeforeBuild) {
    onBeforeBuild({
      filteredQuery,
      paginationQuery,
      sortedQuery,
    })
  }

  const pagination = paginationQuery.build(reqQuery)
  const filter = filteredQuery.build(reqQuery.filtered)
  const sort = sortedQuery.build(reqQuery.sorted)

  return {
    include,
    includeCount,
    where: filter,
    order: sort as any,
    offset: pagination.offset,
    limit: pagination.limit,
  }
}

const PluginSqlizeQuery = {
  generate,
  makeIncludeQueryable,
}

export default PluginSqlizeQuery
