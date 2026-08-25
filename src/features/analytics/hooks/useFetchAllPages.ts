import { useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client/react'
import type { TypedDocumentNode } from '@apollo/client'
import type { PageInfo } from '../../../shared/types/pageInfo'
import type { QueryState } from '../../../shared/types/queryState'
import type { PageVars } from '../types'

export function useFetchAllPages<TData, TItem>(
  query: TypedDocumentNode<TData, PageVars>,
  extractPage: (data: TData) => { info: PageInfo; results: TItem[] },
): QueryState<TItem[]> {
  const client = useApolloClient()
  const [state, setState] = useState<QueryState<TItem[]>>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      const items: TItem[] = []
      let page: number | null = 1

      while (page !== null) {
        const { data } = await client.query({ query, variables: { page } })
        if (!data) throw new Error('No data returned')
        const { info, results } = extractPage(data)
        items.push(...results)
        page = info.next
      }

      if (!cancelled) {
        setState(items.length === 0 ? { status: 'empty' } : { status: 'success', data: items })
      }
    }

    fetchAll().catch((error: Error) => {
      if (!cancelled) setState({ status: 'error', message: error.message })
    })

    return () => {
      cancelled = true
    }
    // Deliberately only depends on `client` — this is a one-shot fetch-all
    // triggered on mount. `query`/`extractPage` are stable per call site, and
    // including them would risk re-running the full page loop on unrelated re-renders.
  }, [client])

  return state
}
