import qs from 'qs'
import getMockBingSearchResults from 'js/components/Search/getMockBingSearchResults'
import { getSearchResultCountPerPage } from 'js/utils/search-utils'
import { getBingClientID } from 'js/utils/local-user-data-mgr'
import getBingMarketCode from 'js/components/Search/getBingMarketCode'
import { getUrlParameters } from 'js/utils/utils'

// Note: this module should reasonably stand on its own because
// it may load prior to app code via a separate JS entry point,
// which speeds up fetching search results. We also call this
// module via app code.

/**
 * Call our search API endpoint. All parameters must be optional.
 * @param {String} providedQuery - The search query, unencoded.
 * @param {Object} options - Additional search parameters to send.
 * @param {Number} options.page - The 1-based search results page number.
 * @return {Object}
 */
const fetchBingSearchResults = async (providedQuery = null, { page } = {}) => {
  // MEASURING PERFORMANCE
  if (window && window.performance && window.debug) {
    var t = performance.now()
    console.log('query', t)
    console.log('provided query value', providedQuery)
    window.debug.query = t
  }

  // If no query value is provided, try to get it from the "q"
  // URL parameter.
  const urlParams = getUrlParameters()
  const query = providedQuery || urlParams.q || null

  // TODO:
  // If a search query is in progress via an earlier request,
  // wait for it. If one is complete, use its data. This may
  // happen via another JS entry point that we prioritize to
  // speed up fetching the search results.

  if (!query) {
    throw new Error(`Search query must be a non-empty string.`)
  }
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.REACT_APP_MOCK_SEARCH_RESULTS === 'true'
  ) {
    // Mock search results, including network delay.
    return new Promise(resolve => {
      setTimeout(() => resolve(getMockBingSearchResults()), 400)
    })
  }
  try {
    const endpoint = process.env.REACT_APP_SEARCH_QUERY_ENDPOINT
    if (!endpoint) {
      throw new Error('Search query endpoint is not defined.')
    }

    // Determine the search results page number, using the "page"
    // query parameter if not provided.
    let pageNumber = 0
    if (page && page > 0) {
      pageNumber = page - 1
    } else {
      const paramPageNum = parseInt(urlParams.page, 10)
      if (!isNaN(paramPageNum) && paramPageNum > 0) {
        pageNumber = paramPageNum - 1
      }
    }

    // The mkt parameter is not required but highly recommended.
    const mkt = await getBingMarketCode()

    const offset = getSearchResultCountPerPage() * pageNumber

    const bingClientID = getBingClientID()
    const searchURL = `${endpoint}?${qs.stringify({
      q: query,
      count: getSearchResultCountPerPage(),
      // The maximum number of mainline ads to return.
      mainlineCount: 3,
      // The zero-based page number, used for ads.
      pageNumber: pageNumber,
      // The maximum number of sidebar ads to return.
      sidebarCount: 0,
      // A list of extensions to include with the text ads.
      // By default, ads will not include extensions. See ads
      // documentation for possible values.
      supportedAdExtensions: 'EnhancedSiteLinks,SiteLinks',
      ...(bingClientID && { bingClientID }),
      ...(mkt && { mkt }),
      ...(offset && { offset }),
    })}&${qs.stringify(
      {
        // Possible values:
        // Computation, Entities, Images, News, RelatedSearches, SpellSuggestions,
        // TimeZone, Videos, Webpages
        // Makes sure commas for list items are not encoded.
        // We should only include answer types that we will display.
        responseFilter: 'Webpages,News,Ads,Computation,TimeZone,Videos',
        // Possible values: TextAds (required), AppInstallAds, ProductAds
        adTypesFilter: 'TextAds',
      },
      { arrayFormat: 'comma', encode: false }
    )}`

    return fetch(searchURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        return response
          .json()
          .then(response => response)
          .catch(e => {
            throw e
          })
      })
      .catch(e => {
        throw e
      })
  } catch (e) {
    throw e
  }
}

// TODO: on load, if the path is /query, try to get the
// search query and page and make the query.

export default fetchBingSearchResults
