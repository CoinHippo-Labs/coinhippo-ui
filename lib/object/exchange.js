import _ from 'lodash'

import { equals_ignore_case } from '../utils'

const cex = ['aax','aax_futures','abcc','abit','acdx','acdx_futures','aex','allcoin','alpha_five','alterdice','altilly','altmarkets','aprobit','artisturba','atomars','b2bx','bakkt','bankera','basefex','bcex','beaxy','bgogo','bibo','bibox','bibox_futures','bidesk','bigone','bigone_futures','biki','biki_futures','bilaxy','binance','binance_futures','binance_jersey','binance_us','equos','bione','bit2c','bitalong','bitbank','bitbay','bitbns','bitbox','bitci','bitcoin_com','bit_com_futures','bitex','bitexbook','bitexlive','bitfex','bitfinex','bitfinex_futures','bitflyer','bitflyer_futures','bitforex','bitforex_futures','bitget','bitget_futures','bithash','bitholic','bithumb','bithumb_futures','bithumb_global','bitinfi','bitkonan','bitkub','bitmart','bitmax','bitmax_futures','bitmesh','bitmex','bitoffer','bitonbay','bitopro','bitpanda','bitrabbit','altcointrader','delta_spot','bitrue','bits_blockchain','bitsdaq','bitso','bitsonic','lcx','bitstamp','bitsten','bitstorage','bittrex','bitubu','bit_z','bitz_futures','bkex','bleutrade','blockchain_com','boa','braziliex','btc_alpha','btcbox','btcc','btc_exchange','btcmarkets','btcmex','btcnext','btcsquare','btc_trade_ua','btcturk','btse','btse_futures','buyucoin','bvnex','bw','flybit','bybit','c2cx','catex','cbx','ccex','cex','chainex','changelly','chiliz','coinzoom','citex','cme_futures','coinall','coinasset','coinbene','coinbig','coinbit','coincheck','coindcx','coindeal','coindirect','coineal','coin_egg','coinex','coinfalcon','coinfield','coinflex','coinflex_futures','coinfloor','coingi','coinhe','coinhub','coinjar','coinlim','coinlist','coinmargin','coin_metro','coinone','coinpark','coinplace','coinsbank','coinsbit','coinsuper','cointiger','cointiger_futures','coinxpro','coinzo','c_patex','cpdax','crex24','crxzone','cryptaldash','cryptex','cryptlocex','crypto_com','kickex','cryptology','crytrex','c_trade','currency','darb_finance','daybit','dcoin','decoin','delta_futures','deribit','dextrade','digifinex','dobitrade','dove_wallet','dragonex','dsx','duedex','ecxx','elitex','emirex','eterbase','etherflyer','etorox','exmarkets','exmo','exnce','exrates','exx','fatbtc','fex','financex','finexbox','floatsv','freiexchange','ftx','ftx_spot','ftx_us','gate','gate_futures','gbx','gdac','gdax','gemini','getbtc','gmo_japan','gmo_japan_futures','gobaba','goku','gopax','graviex','hanbitco','hbtc','hbtc_futures','hb_top','hitbtc','hoo','hopex','hotbit','hpx','hubi','huobi','huobi_dm','huobi_id','huobi_japan','huobi_korea','huobi_thailand','ice3x','idcm','incorex','independent_reserve','indodax','infinity_coin','instantbitex','iqfinex','itbit','jex','jex_futures','kkcoin','k_kex','korbit','kraken','kraken_futures','kucoin','kumex','kuna','lakebtc','latoken','lbank','liquid_derivatives','localtrade','lucent','lukki','luno','lykke','max_maicoin','mercado_bitcoin','mercatox','mercuriex','multi','mxc','mxc_futures','mycoinstory','namebase','nami_exchange','nanu_exchange','narkasa','negociecoins','neraex','nice_hash','nlexch','nominex','novadax','oceanex','okcoin','okex','okex_korea','okex_swap','omgfin','omnitrade','otcbtc','ovex','p2pb2b','paribu','paroexchange','paymium','phemex','phemex_futures','poloniex','poloniex_futures','prime_xbt','probit','qtrade','quoine','resfinex','rfinex','safe_trade','satoexchange','secondbtc','shortex','simex','sinegy','zbx','sistemkoin','six_x','south_xchange','stake_cube','stocks_exchange','stormgain','stormgain_futures','swiftex','tdax','therocktrading','thodex','tidebit','tidex','tokenize','tokenomy','tokens_net','toko_crypto','tokok','tokpie','topbtc','trade_ogre','txbit','unnamed','upbit','upbit_indonesia','vb','vcc','vebitcoin','velic','vindax','vinex','virgox','waves','wazirx','whale_ex','whitebit','xcoex','xfutures','xt','yobit','yunex','zaif','zb','zbg','zbg_futures','zebitex','zebpay','zg','zgtop','zipmex','biconomy','wootrade','bitexen','probit_kr','bybit_spot']
const dex = ['aave','allbit','anyswap','bakeryswap','balancer','balancer_v1','bamboo_relay','bancor','bepswap','binance_dex','binance_dex_mini','birake','bisq','bitcratic','blockonix','bscswap','burgerswap','compound_finance','cream_swap','cream_swap_v1','curve','wault_swap','cybex','ddex','dem_exchange','deversifi','dex_blue','dodo','dolomite','dydx','dydx_perpetual','defi_swap','zero_exchange','value_liquid_bsc','apeswap','comethswap','unicly','sushiswap_fantom','polyzap','ethex','everbloom','forkdelta','swop_fi','secretswap','pantherswap','zilswap','dydx_perpetual_l1','futureswap','honeyswap','spookyswap','idex','dodo_bsc','joyso','justswap','kyber_network','zkswap','leverj','linkswap','loopring','loopring_amm','luaswap','dmm','sushiswap_polygon','swapr','mdex_bsc','ubeswap','sushiswap_xdai','mcdex','mdex','mesa','mirror','mooniswap','nash','viperswap','neblidex','newdex','nexus_mutual','oasis_trade','one_inch','one_inch_liquidity_protocol','spiritswap','orderbook','pancakeswap','pangolin','paraswap','raydium','perpetual_protocol','polyient_dex','quickswap','julswap','radar_relay','sakeswap','sashimiswap','saturn_network','serum_dex','serumswap','stellar_term','streetswap','sushiswap','switcheo','synthetix','tokenlon','token_sets','tomodex','dfyn','levinswap_xdai','tron_trade','trx_market','uniswap','uniswap_v1','uniswap_v2','vitex','value_liquid','zero_ex','pancakeswap_others','kuswap','shibaswap','pancakeswap_new','osmosis','waultswap_polygon','orca','honeyswap_polygon','swapr_ethereum','pinkswap','traderjoe','ref_finance','mimo','sushiswap_arbitrum','balancer_polygon','sushiswap_harmony','baguette','cherryswap','acsi_finance']

export const exchange_type = id => cex.includes(id) ? 'centralized' : dex.includes(id) ? 'decentralized' : ''

const referrals = {
  ftx: { id: 'ftx_spot', code: '10237779', reward_commission_percent: 25, discount_commission_percent: 5, exchange_ids: ['ftx_spot', 'ftx'] },
  binance: { id: 'binance', code: 'U2QW5HSA', reward_commission_percent: 10, discount_commission_percent: 10, exchange_ids: ['binance', 'binance_futures'] },
  coinbase: { id: 'gdax', code: '9251' },
  kraken: { id: 'kraken', code: '10583' },
  bitfinex: { id: 'bitfinex', code: 'BG4ZysMMB' },
  gate: { id: 'gate', code: '3159833', reward_commission_percent: 20, discount_commission_percent: 20, exchange_ids: ['gate', 'gate_futures'] },
  gemini: { id: 'gemini', code: '' },
  crypto: { id: 'crypto_com', code: '' },
  huobi_global: { id: 'huobi', code: '8z6g8' },
  okex: { id: 'okex', code: '3781714' },
  kucoin: { id: 'kucoin', code: 'rJ31MYJ' },
  poloniex: { id: 'poloniex', code: 'LS632G9R', reward_commission_percent: 20, discount_commission_percent: 10, exchange_ids: ['poloniex'] },
  latoken: { id: 'latoken', code: 'cpy9ir968m' },
  bithumb_pro: { id: 'bithumb_global', code: '299eat', reward_commission_percent: 10, discount_commission_percent: 10, exchange_ids: ['bithumb_global'] },
  bitkub: { id: 'bitkub', code: '52244' },
  bkex: { id: 'bkex', code: 'FUWQBRWQ' },
  bitrue: { id: 'bitrue', code: 'UBBSmjbe' },
  bitmex: { id: 'bitmex', code: 'fdc3ji' },
  bybit: { id: 'bybit', code: '15895' },
  cex: { id: 'cex', code: 'up136014827' },
  changelly: { id: 'changelly', code: 'zlv6bmmuf7vv9rwe' },
  bitmart: { id: 'bitmart', code: 'Pp5xEb' },
  mxc: { id: 'mxc', code: '15fmF' },
  coinlist: { id: 'coinlist', code: 'FGKPXQ' },
  xcoins: { code: '1586' },
  paxful: { code: 'Z3k3RpbAqYb' },
  changenow: { code: 'b6b2d58cce293d' },
}

export const affiliate_links = urls => {
  const isArray = Array.isArray(urls)
  urls = typeof urls === 'string' ? [urls] : urls || []
  urls = urls.map(url => {
    try {
      const u = new URL(url)
      const hostname = u.hostname
      if (hostname === 'www.binance.com' || hostname === 'www.binance.us') {
        url = `${u.protocol}//${hostname}${u.pathname}?ref=${referrals.binance.code}`
      }
      else if (hostname === 'www.coinbase.com') {
        url = `${u.protocol}//coinbase-consumer.sjv.io/c/2664740/552039/${referrals.coinbase.code}`
      }
      else if (hostname === 'r.kraken.com' || hostname === 'futures.kraken.com') {
        if (u.pathname.indexOf('/dashboard') < 0) {
          url = `${u.protocol}//r.kraken.com/c/2664740/741638/${referrals.kraken.code}`
        }
      }
      else if (hostname === 'www.bitfinex.com') {
        url = `${u.protocol}//${hostname}${u.pathname}?refcode=${referrals.bitfinex.code}`
      }
      else if (hostname === 'gate.io' || hostname === 'www.gate.io') {
        url = `${u.protocol}//${hostname}${u.pathname.indexOf('trade/') > -1 ? `${u.pathname}?ref=` : '/signup/'}${referrals.gate.code}`
      }
      else if (hostname === 'ftx.com' || hostname === 'ftx.us') {
        if (u.pathname.indexOf('/trade') < 0) {
          url = `${u.protocol}//${hostname}/#a=${referrals.ftx.code}`
        }
      }
      else if (hostname === 'crypto.com') {
        if (u.pathname.indexOf('/trade') < 0) {
          url = `${u.protocol}//${hostname}${u.pathname}/${referrals.crypto.code}`
        }
      }
      else if (hostname === 'gemini.sjv.io') {
        // url = `${u.protocol}//${hostname}/${referrals.gemini.code}`
        url = `${u.protocol}//www.gemini.com`
      }
      else if (hostname === 'www.huobi.com' || hostname === 'www.hbdm.com' || hostname === 'dm.huobi.com') {
        url = `${u.protocol}//www.huobi.com/en-us/topic/invited/?invite_code=${referrals.huobi_global.code}`
      }
      else if (hostname === 'www.okex.com') {
        if (u.pathname.indexOf('/market') < 0 && u.pathname.indexOf('/future') < 0 && u.pathname.indexOf('/trade') < 0) {
          url = `${u.protocol}//${hostname}/join/${referrals.okex.code}`
        }
        else if (u.pathname.indexOf('/market') > -1) {
          url = `${u.protocol}//${hostname}/spot/trade${u.search.replace('?product=', '/').replace('_', '-')}`
        }
      }
      else if (hostname === 'www.bitstamp.net') {
        // wait
      }
      else if (hostname === 'www.kucoin.com' || hostname === 'futures.kucoin.com') {
        if (u.pathname.indexOf('/trade') < 0 || hostname === 'futures.kucoin.com') {
          url = `${u.protocol}//www.kucoin.com/ucenter/signup?rcode=${referrals.kucoin.code}`
        }
      }
      else if (hostname === 'bittrex.com') {

      }
      else if (hostname === 'poloniex.com') {
        if (u.pathname.indexOf('/exchange') < 0 && u.pathname.indexOf('/futures') < 0) {
          url = `${u.protocol}//${hostname}/signup?c=${referrals.poloniex.code}`
        }
      }
      else if (hostname === 'latoken.com') {
        if (u.pathname.indexOf('/exchange') < 0) {
          url = `${u.protocol}//${hostname}/invite?r=${referrals.latoken.code}`
        }
      }
      else if (hostname === 'bithumb.pro') {
        url = `${u.protocol}//${hostname}/register;i=${referrals.bithumb_pro.code}`
      }
      else if (hostname === 'www.bitkub.com') {
        if (u.pathname.indexOf('/market') < 0) {
          url = `${u.protocol}//${hostname}/signup?ref=${referrals.bitkub.code}`
        }
      }
      else if (hostname === 'www.bitopro.com') {

      }
      else if (hostname === 'www.nicehash.com') {
        // wait
      }
      else if (hostname === 'www.bkex.com') {
        if (u.pathname.indexOf('/trade') < 0 && u.hash.indexOf('/trade') < 0) {
          url = `${u.protocol}//${hostname}/register/${referrals.bkex.code}`
        }
      }
      else if (hostname === 'www.xt.com') {

      }
      else if (hostname === 'whitebit.com') {

      }
      else if (hostname === 'www.bitrue.com') {
        if (u.pathname.indexOf('/trading') < 0 && u.pathname.indexOf('/trade') < 0) {
          url = `${u.protocol}//${hostname}/activity/task/task-landing?inviteCode=${referrals.bitrue.code}&cn=900000`
        }
        else if (u.pathname.indexOf('/trade') > -1) {
          url = `${u.protocol}//${hostname}${u.pathname}?inviteCode=${referrals.bitrue.code}`
        }
      }
      else if (hostname === 'www.hoo.com') {

      }
      else if (hostname === 'coinsbit.io') {

      }
      else if (hostname === 'www.coinbene.com') {

      }
      else if (hostname === 'bitflyer.com') {
        // wait
      }
      else if (hostname === 'www.bitmex.com') {
        if (u.pathname.indexOf('/trade') < 0) {
          url = `${u.protocol}//${hostname}/register/${referrals.bitmex.code}`
        }
      }
      else if (hostname === 'www.bybit.com') {
        if (u.pathname.indexOf('/exchange') > -1) {
          url = `${u.protocol}//${hostname}${u.pathname}?affiliate_id=${referrals.bybit.code}&language=en-US&group_id=0&group_type=1`
        }
        else {
          url = `${u.protocol}//partner.bybit.com/b/${referrals.bybit.code}`
        }
      }
      else if (hostname === 'cex.io') {
        url = `${u.protocol}//${hostname}/r/0/${referrals.cex.code}/0/`
      }
      else if (hostname === 'pro.changelly.com') {
        url = `${u.protocol}//changelly.com${u.search ? u.search.toLowerCase() : '?from=btc&to=usdt'}&amount=0.1&ref_id=${referrals.changelly.code}`
      }
      else if (hostname === 'etoro.com') {
        // wait
      }
      else if (hostname === 'exmo.com') {
        // wait
      }
      else if (hostname === 'www.bitmart.com') {
        url = `${u.protocol}//${hostname}${u.pathname}${u.search ? `${u.search}&` : '?'}r=${referrals.bitmart.code}`
      }
      else if (hostname === 'www.mxc.com') {
        if (u.pathname.indexOf('/trade') < 0) {
          url = `${u.protocol}//${hostname}/auth/signup?inviteCode=${referrals.mxc.code}`
        }
      }
      else if (hostname === 'pro.coinlist.co') {
        if (u.pathname.indexOf('/trader') < 0) {
          url = `${u.protocol}//coinlist.co/clt?referral_code=${referrals.coinlist.code}`
        }
      }
      // not on list
      else if (hostname === 'www.xcoins.com') {
        url = `${u.protocol}//${hostname}/2020/r.php?id=${referrals.xcoins.code}`
      }
      else if (hostname === 'paxful.com') {
        url = `${u.protocol}//${hostname}/?r=${referrals.paxful.code}`
      }
      else if (hostname === 'www.coinmama.com') {
        // wait
      }
      else if (hostname === 'changenow.io') {
        url = `${u.protocol}//${hostname}?link_id=${referrals.changenow.code}`
      }
    } catch (error) {}
    return url
  })
  return isArray ? urls : urls.join('')
}

export const trade_url = t =>
  !t.trade_url && t.market?.identifier === 'bitstamp' ?
    `https://www.${t.market.identifier}.net/markets/${t.base?.toLowerCase()}/${t.target?.toLowerCase()}` :
    t.trade_url?.indexOf('www.bitrue.com') > -1 ?
      `https://www.bitrue.com/trade/${t.base?.toLowerCase()}_${t.target?.toLowerCase()}` :
      t.trade_url === 'https://pro.changelly.com' ?
        `${t.trade_url}/?from=${t.base}&to=${t.target}` :
        !t.trade_url && t.market?.identifier === 'gemini' ?
          `https://exchange.gemini.com/buy/${t.base?.toLowerCase()}${t.target?.toLowerCase()}` :
          t.trade_url

const custom_trades = [
  { id: 'binance', url: 'https://www.binance.com', trade_url: 'https://www.binance.com/en/trade/{base}_{target}', isUpperCase: true, default_target: 'usdt', support_pairs: [{ base: 'bitcoin' }, { base: 'ethereum' }, { base: 'dogecoin' }, { base: 'binance-usd' }, { base: 'binancecoin' }, { base: 'ripple' }, { base: 'polkadot' }, { base: 'internet-computer' }, { base: 'ethereum-classic' }, { base: 'cardano' }, { base: 'shiba-inu' }, { base: 'axie-infinity' }, { base: 'matic-network' }, { base: 'filecoin' }, { base: 'vechain' }, { base: 'chainlink' }, { base: 'usd-coin' }, { base: 'solana' }, { base: 'qtum' }, { base: 'litecoin' }, { base: 'terra-luna' }, { base: 'eos' }, { base: 'my-neighbor-alice' }, { base: 'theta-token' }, { base: 'badger-dao' }, { base: 'truefi' }, { base: 'uniswap' }, { base: 'alien-worlds' }, { base: 'bitcoin-cash' }, { base: 'stafi' }, { base: 'tornado-cash' }, { base: 'smooth-love-potion' }, { base: 'tron' }, { base: 'thorchain' }, { base: 'pancakeswap-token' }, { base: 'bittorrent-2' }, { base: 'alpha-finance' }, { base: 'aave' }, { base: 'chiliz' }, { base: 'kava' }, { base: 'stellar' }, { base: 'bakerytoken' }, { base: 'swipe' }, { base: 'omisego' }, { base: 'neo' }, { base: 'sushi' }, { base: 'streamr-datacoin' }, { base: 'venus' }, { base: 'the-graph' }, { base: 'the-sandbox' }, { base: 'ravencoin' }, { base: 'enjincoin' }, { base: 'polkastarter' }, { base: 'holotoken' }, { base: 'chromaway' }, { base: 'mask-network' }, { base: 'compound-governance-token' }, { base: 'cosmos' }, { base: 'zcash' }, { base: 'wink' }, { base: 'coin98' }, { base: 'havven' }, { base: 'kusama' }, { base: 'mainframe' }, { base: 'avalanche-2' }, { base: '1inch' }, { base: 'fantom' }, { base: 'algorand' }, { base: 'ontology' }, { base: 'decentraland' }, { base: 'injective-protocol' }, { base: 'band-protocol' }, { base: 'gitcoin' } ] },
  { id: 'gdax', url: 'https://www.coinbase.com', trade_url: 'https://pro.coinbase.com/trade/{base}-{target}', isUpperCase: true, default_target: 'usd', support_pairs: [{ base: 'bitcoin' }, { base: 'ethereum' }, { base: 'dogecoin' }, { base: 'cardano' }, { base: 'dai' }, { base: 'chainlink' }, { base: 'matic-network' }, { base: 'tether' }, { base: 'alchemy-pay' }, { base: 'litecoin' }, { base: 'ethereum-classic' }, { base: 'internet-computer' }, { base: 'wrapped-bitcoin' }, { base: 'uniswap' }, { base: 'filecoin' }, { base: 'stellar' }, { base: 'polkadot' }, { base: 'aave' }, { base: 'compound-governance-token' }, { base: 'bitcoin-cash' }, { base: 'eos' }, { base: 'usd-coin' }, { base: 'sushi' }, { base: 'solana' }, { base: 'cosmos' }, { base: 'yearn-finance' }, { base: 'amp-token' }, { base: 'the-graph' }, { base: 'algorand' }, { base: 'maker' }, { base: 'tezos' }, { base: 'omisego' }, { base: '0x' }, { base: 'dash' }, { base: 'havven' }, { base: 'ankr' }, { base: 'enjincoin' }, { base: 'orchid-protocol' }, { base: 'curve-dao-token' }, { base: '1inch' }, { base: 'storj' }, { base: 'zcash' }, { base: 'quant-network' }, { base: 'republic-protocol' }, { base: 'mask-network' }, { base: 'decentraland' }, { base: 'paxos-standard' }, { base: 'uma' }, { base: 'band-protocol' }, { base: 'iexec-rlc' }, { base: 'basic-attention-token' }, { base: 'kyber-network' }, { base: 'melon' } ] },
  { id: 'huobi', url: 'https://www.huobi.com', trade_url: 'https://www.hbg.com/en-us/exchange/?s={base}_{target}', default_target: 'usdt', support_pairs: [{ base: 'bitcoin' }, { base: 'ethereum' }, { base: 'dogecoin' }, { base: 'tether' }, { base: 'eos' }, { base: 'filecoin' }, { base: 'internet-computer' }, { base: 'casper-network' }, { base: 'alchemy-pay' }, { base: 'usd-coin' }, { base: 'ripple' }, { base: 'axie-infinity' }, { base: 'shiba-inu' }, { base: 'bittorrent-2' }, { base: 'litecoin' }, { base: 'polkadot' }, { base: 'tron' }, { base: 'ethereum-classic' }, { base: 'cardano' }, { base: 'bitcoin-cash' }, { base: 'chainlink' }, { base: 'flow' }, { base: 'sun-token' }, { base: 'huobi-token' }, { base: 'matic-network' }, { base: 'uniswap' }, { base: 'aave' }, { base: 'wrapped-bitcoin' }, { base: 'stellar' }, { base: 'just' }, { base: 'terra-luna' }, { base: 'sushi' }, { base: 'solana' }, { base: 'theta-token' }, { base: 'yearn-finance' }, { base: 'compound-governance-token' }, { base: 'vechain' }, { base: 'bitcoin-cash-sv' }, { base: 'yfii-finance' }, { base: 'dai' }, { base: 'cosmos' }, { base: 'the-graph' }, { base: 'havven' }, { base: 'ftx-token' }, { base: 'kusama' }, { base: 'zcash' }, { base: 'monero' }, { base: 'mask-network' }, { base: 'bitcoin-cash' }, { base: 'chia' }, { base: 'curve-dao-token' }, { base: 'tezos' }, { base: 'omisego' }, { base: 'pha' }, { base: 'zkswap' }, { base: 'dash' }, { base: 'enjincoin' }, { base: 'neo' }, { base: 'decentraland' }, { base: 'algorand' }, { base: 'the-sandbox' }, { base: 'qtum' }, { base: 'chiliz' }, { base: '1inch' }, { base: '0x' }, { base: 'badger-dao' }, { base: 'mdex' }, { base: 'stafi' }, { base: 'ontology' }, { base: 'waves' }, { base: 'basic-attention-token' }, { base: 'nem' }, { base: 'chromaway' }, { base: 'near' }, { base: 'eminer' }, { base: 'storj' }, { base: 'kan' }, { base: 'maker' } ] },
  { id: 'ftx_spot', url: 'https://ftx.com', trade_url: 'https://ftx.com/trade/{base}/{target}', isUpperCase: true, default_target: 'usd', support_pairs: [{ base: 'bitcoin' }, { base: 'ethereum' }, { base: 'tether' }, { base: 'ftx-token' }, { base: 'litecoin' }, { base: 'ripple' }, { base: 'binancecoin' }, { base: 'chainlink' }, { base: 'yearn-finance' }, { base: 'dogecoin' }, { base: 'dai' }, { base: 'bitcoin-cash' }, { base: 'solana' }, { base: 'tron' }, { base: 'maker' }, { base: 'celsius-degree-token' }, { base: 'omisego' }, { base: 'sushi' }, { base: 'uniswap' }, { base: 'aave' }, { base: 'kyber-network' }, { base: 'swipe' }, { base: 'matic-network' }, { base: 'axie-infinity' }, { base: 'serum' }, { base: 'thorchain' }, { base: 'tomoe' }, { base: 'bilira' }, { base: 'compound-governance-token' }, { base: 'fantom' }, { base: 'basic-attention-token' }, { base: '0x' }, { base: 'perpetual-protocol' }, { base: 'brz' }, { base: '1inch' }, { base: 'alpha-finance' }, { base: 'huobi-token' }, { base: 'raydium' }, { base: 'havven' }, { base: 'the-graph' }, { base: 'linear' }, { base: 'curve-dao-token' }, { base: 'chiliz' }, { base: 'alchemix' }, { base: 'badger-dao' }, { base: 'cream-2' }, { base: 'band-protocol' }, { base: 'pax-gold' } ] },
  { id: 'kraken', url: 'https://r.kraken.com', trade_url: 'https://trade.kraken.com/markets/kraken/{base}/{target}', default_target: 'usd', support_pairs: [{ base: 'bitcoin' }, { base: 'ethereum' }, { base: 'tether' }, { base: 'usd-coin' }, { base: 'litecoin' }, { base: 'chainlink' }, { base: 'dogecoin' }, { base: 'cardano' }, { base: 'polkadot' }, { base: 'ripple' }, { base: 'bitcoin-cash' }, { base: 'filecoin' }, { base: 'stellar' }, { base: 'matic-network' }, { base: 'dai' }, { base: 'tron' }, { base: 'monero' }, { base: 'aave' }, { base: 'uniswap' }, { base: 'tezos' }, { base: 'solana' }, { base: 'zcash' }, { base: 'eos' }, { base: 'ethereum-classic' }, { base: 'cosmos' }, { base: 'algorand' }, { base: 'yearn-finance' }, { base: 'omisego' }, { base: 'dash' }, { base: 'the-graph' }, { base: 'decentraland' }, { base: 'basic-attention-token' }, { base: 'kusama' }, { base: 'omisego' }, { base: 'flow' }, { base: 'qtum' }, { base: 'compound-governance-token' }, { base: 'waves' }, { base: 'ocean-protocol' } ] },
  { id: 'bitfinex', url: 'https://www.bitfinex.com', trade_url: 'https://www.bitfinex.com/t/{base}{target}', isUpperCase: true, default_target: 'usd', support_pairs: [{ base: 'bitcoin' }, { base: 'ethereum' }, { base: 'tether' }, { base: 'litecoin' }, { base: 'eos' }, { base: 'ripple' }, { base: 'dogecoin' }, { base: 'monero' }, { base: 'cardano' }, { base: 'polkadot' }, { base: 'sushi' }, { base: 'solana' }, { base: 'tezos' }, { base: 'neo' }, { base: 'chainlink' }, { base: 'tron' }, { base: 'zcash' }, { base: 'uniswap' }, { base: 'dash' }, { base: 'bitcoin-cash' }, { base: 'yearn-finance' }, { base: 'filecoin' }, { base: 'omisego' }, { base: 'iota' }, { base: '0x' }, { base: 'paxos-standard' }, { base: 'ethereum-classic' }, { base: 'bitcoin-cash-sv' }, { base: 'usd-coin' }, { base: 'terra-luna' }, { base: 'stellar' }, { base: 'kusama' }, { base: 'dai' }, { base: 'tether-gold' }, { base: 'aave' }, { base: 'vechain' }, { base: 'cosmos' }, { base: 'bitcoin-gold' }, { base: 'compound-governance-token' }, { base: 'avalanche-2' }, { base: 'reef-finance' }, { base: 'elrond-erd-2' }, { base: 'algorand' }, { base: 'rootstock' }, { base: 'waves' }, { base: 'ocean-protocol' }, { base: 'the-graph' } ] },
  { id: 'okex', url: 'https://www.okex.com', trade_url: 'https://www.okex.com/market?product={base}_{target}', default_target: 'usdt', support_pairs: [{ base: 'bitcoin' }, { base: 'ethereum' }, { base: 'dogecoin' }, { base: 'usd-coin' }, { base: 'okb' }, { base: 'polkadot' }, { base: 'ethereum-classic' }, { base: 'wrapped-bitcoin' }, { base: 'bitcoin-cash' }, { base: 'litecoin' }, { base: 'dai' }, { base: 'internet-computer' }, { base: 'filecoin' }, { base: 'terra-luna' }, { base: 'chainlink' }, { base: 'eos' }, { base: 'ripple' }, { base: 'uniswap' }, { base: 'solana' }, { base: 'matic-network' }, { base: 'casper-network' }, { base: 'tether' }, { base: 'bitcoin-cash-sv' }, { base: 'axie-infinity' }, { base: 'theta-token' }, { base: 'cardano' }, { base: 'aave' }, { base: 'stellar' }, { base: 'shiba-inu' }, { base: 'omisego' }, { base: 'sushi' }, { base: 'compound-governance-token' }, { base: 'bittorrent-2' }, { base: 'qtum' }, { base: 'polkadot' }, { base: 'neo' }, { base: 'tron' }, { base: 'kusama' }, { base: 'zcash' }, { base: 'the-graph' }, { base: 'chiliz' }, { base: 'cosmos' }, { base: '1inch' }, { base: 'okexchain' }, { base: 'dash' }, { base: 'yfii-finance' }, { base: 'bitcoin-cash' }, { base: 'solana' }, { base: 'yearn-finance' }, { base: 'avalanche-2' }, { base: 'havven' }, { base: 'monero' }, { base: 'elrond-erd-2' }, { base: 'curve-dao-token' }, { base: 'enjincoin' }, { base: 'algorand' }, { base: 'tezos' }, { base: 'swarm-bzz' }, { base: 'crypto-com-chain' }, { base: 'ravencoin' }, { base: 'basic-attention-token' }, { base: 'aave' }, { base: 'nem' }, { base: 'the-sandbox' }, { base: 'theta-token' }, { base: 'mina-protocol' }, { base: 'mask-network' }, { base: '0x' }, { base: 'flow' }, { base: 'ontology' }, { base: 'hedera-hashgraph' }, { base: 'maker' }, { base: 'ecash' }, { base: 'aavegotchi' }, { base: 'near' }, { base: 'true-usd' }, { base: 'molecular-future' }, { base: 'decentraland' } ] },
  { id: 'kucoin', url: 'https://www.kucoin.com', trade_url: 'https://www.kucoin.com/trade/{base}-{target}', isUpperCase: true, default_target: 'usdt', support_pairs: [{ base: 'bitcoin' }, { base: 'ethereum' }, { base: 'dogecoin' }, { base: 'usd-coin' }, { base: 'ripple' }, { base: 'internet-computer' }, { base: 'kok-coin' }, { base: 'bitcoin-cash' }, { base: 'terra-luna' }, { base: 'cardano' }, { base: 'matic-network' }, { base: 'uniswap' }, { base: 'eos' }, { base: 'vechain' }, { base: 'binancecoin' }, { base: 'polkadot' }, { base: 'shiba-inu' }, { base: 'kucoin-shares' }, { base: 'filecoin' }, { base: 'kusama' }, { base: 'pancakeswap-token' }, { base: 'chainlink' }, { base: 'aave' }, { base: 'stellar' }, { base: 'zcash' }, { base: 'basic-attention-token' }, { base: 'cosmos' }, { base: 'algorand' }, { base: 'tron' }, { base: 'litecoin' }, { base: 'dash' }, { base: 'sushi' }, { base: 'mirror-protocol' }, { base: 'vechain' }, { base: 'the-graph' }, { base: '1inch' }, { base: 'axie-infinity' }, { base: 'xdce-crown-sale' }, { base: 'neo' }, { base: 'theta-token' }, { base: 'telcoin' }, { base: 'tezos' }, { base: 'fantom' }, { base: 'ethereum-classic' }, { base: 'enjincoin' }, { base: 'monero' }, { base: 'celo-dollar' }, { base: 'bittorrent-2' }, { base: 'swipe' }, { base: 'verasity' }, { base: 'havven' }, { base: 'crypto_com' }, { base: '2crazynft' }, { base: 'ontology' }, { base: 'constellation-labs' }, { base: 'celo-euro' }, { base: 'maker' }, { base: 'dent' }, { base: 'avalanche-2' }, { base: 'neutrino' }, { base: 'quant-network' }, { base: 'chiliz' }, { base: 'the-sandbox' } ] },
  { id: 'crypto_com', url: 'https://crypto.com', trade_url: 'https://crypto.com/exchange/trade/spot/{base}_{target}', isUpperCase: true, default_target: 'usdt', support_pairs: [{ base: 'bitcoin' }, { base: 'ethereum' }, { base: 'cardano' }, { base: 'polkadot' }, { base: 'dogecoin' }, { base: 'ripple' }, { base: 'matic-network' }, { base: 'chainlink' }, { base: 'litecoin' }, { base: 'vechain' }, { base: 'usd-coin' }, { base: 'shiba-inu' }, { base: 'eos' }, { base: 'bitcoin-cash' }, { base: 'filecoin' }, { base: 'kusama' }, { base: 'theta-token' }, { base: 'uniswap' }, { base: 'stellar' }, { base: 'elrond-erd-2' }, { base: 'axie-infinity' }, { base: 'aave' }, { base: 'solana' }, { base: 'sushi' }, { base: 'chiliz' }, { base: 'kava' }, { base: 'qtum' }, { base: 'flow' }, { base: 'the-sandbox' }, { base: 'omisego' }, { base: 'enjincoin' }, { base: 'ankr' }, { base: 'terra-luna' }, { base: 'cosmos' }, { base: 'neo' }, { base: 'basic-attention-token' }, { base: 'compound-governance-token' }, { base: 'zilliqa' }, { base: 'decentraland' }, { base: 'algorand' }, { base: 'chromaway' }, { base: 'avalanche-2' }, { base: 'tezos' }, { base: 'ontology' }, { base: 'iexec-rlc' }, { base: 'theta-fuel' }, { base: 'havven' }, { base: 'holotoken' }, { base: 'curve-dao-token' }, { base: 'crypto-com-chain' }, { base: 'icon' }, { base: 'origin-protocol' }, { base: 'reserve-rights-token' }, { base: 'near' }, { base: '1inch' }, { base: 'yearn-finance' }, { base: 'celar-network' }, { base: 'waves' }, { base: 'ocean-protocol' }, { base: 'balancer' }, { base: 'harmony' }, { base: 'maker' }, { base: 'tellor' }, { base: 'band-protocol' }, { base: 'kyber-network' } ] },
  { id: 'gemini', url: 'https://www.gemini.com', trade_url: 'https://exchange.gemini.com/buy/{base}{target}', isUpperCase: true, default_target: 'usd', support_pairs: [{ base: 'bitcoin' }, { base: 'ethereum' }, { base: 'dai' }, { base: 'chainlink' }, { base: 'dogecoin' }, { base: 'litecoin' }, { base: 'filecoin' }, { base: 'matic-network' }, { base: 'bitcoin-cash' }, { base: 'uniswap' }, { base: 'zcash' }, { base: 'yearn-finance' }, { base: '0x' }, { base: 'aave' }, { base: 'compound-governance-token' }, { base: 'basic-attention-token' }, { base: 'amp-token' }, { base: 'sushi' }, { base: 'the-graph' }, { base: 'maker' }, { base: 'storj' }, { base: 'havven' }, { base: 'decentraland' }, { base: 'orchid-protocol' }, { base: 'curve-dao-token' }, { base: 'enjincoin' }, { base: 'republic-protocol' }, { base: 'the-sandbox' }, { base: 'mirror-protocol' }, { base: 'uma' }, { base: 'tezos' }, { base: 'ankr' }, { base: 'fantom' }, { base: 'injective-protocol' }, { base: 'pax-gold' }, { base: 'balancer' }, { base: 'somnium-space-cubes' }, { base: 'loopring' }, { base: '1inch' }, { base: 'livepeer' }, { base: 'alchemix' }, { base: 'bitcoin-cash' }, { base: 'barnbridge' }, { base: 'cryptex-finance' }, { base: 'kyber-network' }, { base: 'bancor' } ] },
  { id: 'bittrex', url: 'https://bittrex.com', trade_url: 'https://bittrex.com/Market/Index?MarketName{base}-{target}', isUpperCase: true, default_target: 'usdt', support_pairs: [{ base: 'bitcoin' }, { base: 'ethereum' }, { base: 'tether' }, { base: 'cardano' }, { base: 'usd-coin' }, { base: 'dogecoin' }, { base: 'ripple' }, { base: 'terra-luna' }, { base: 'litecoin' }, { base: 'hedera-hashgraph' }, { base: 'true-usd' }, { base: 'stellar' }, { base: 'bitcoin-cash' }, { base: 'chainlink' }, { base: 'polkadot' }, { base: 'tron' }, { base: 'vechain' }, { base: 'uniswap' }, { base: 'ethereum-classic' }, { base: 'eos' }, { base: 'enjincoin' }, { base: 'ravencoin' }, { base: 'matic-network' }, { base: 'nem' }, { base: 'neo' }, { base: 'crypto-com-chain' }, { base: 'quant-network' }, { base: 'omisego' }, { base: 'tezos' }, { base: 'cosmos' }, { base: 'basic-attention-token' }, { base: 'digibyte' }, { base: 'decentraland' }, { base: 'celo-dollar' }, { base: 'waves' }, { base: 'zilliqa' } ] },
  { id: 'gate', url: 'https://gate.io', trade_url: 'https://gate.io/trade/{base}_{target}', isUpperCase: true, default_target: 'usdt', support_pairs: [{ base: 'bitcoin' }, { base: 'ethereum' }, { base: 'dogecoin' }, { base: 'wrapped-bitcoin' }, { base: 'litecoin' }, { base: 'filecoin' }, { base: 'ripple' }, { base: 'eos' }, { base: 'polkadot' }, { base: 'bitcoin-cash' }, { base: 'ethereum-classic' }, { base: 'cardano' }, { base: 'matic-network' }, { base: 'chainlink' }, { base: 'uniswap' }, { base: 'binancecoin' }, { base: 'livepeer' }, { base: 'shiba-inu' }, { base: 'tron' }, { base: 'zcash' }, { base: 'casper-network' }, { base: 'sushi' }, { base: 'huobi-token' }, { base: 'dash' }, { base: 'internet-computer' }, { base: 'algorand' }, { base: 'bitcoin-cash-sv' }, { base: 'the-graph' }, { base: 'kusama' }, { base: 'usd-coin' }, { base: '1inch' }, { base: 'qtum' }, { base: 'curve-dao-token' }, { base: 'aave' }, { base: 'cosmos' }, { base: 'ontology' }, { base: 'gatechain-token' }, { base: 'loopring' }, { base: 'solana' }, { base: 'bittorrent-2' }, { base: 'stellar' }, { base: 'dodo' }, { base: 'tezos' }, { base: 'theta-token' }, { base: 'reserve-rights-token' }, { base: 'okb' }, { base: 'terra-luna' }, { base: 'monero' }, { base: 'paxos-standard' }, { base: 'chiliz' }, { base: 'omisego' }, { base: 'havven' }, { base: 'avalanche-2' }, { base: 'pha' }, { base: 'zilliqa' }, { base: 'thorchain' }, { base: 'nervos-network' }, { base: 'neo' }, { base: 'republic-protocol' }, { base: 'vechain' }, { base: 'ocean-protocol' }, { base: 'zencash' }, { base: 'chia' }, { base: 'polkastarter' }, { base: 'maker' }, { base: 'waves' }, { base: 'binance-usd' }, { base: 'just' }, { base: 'true-usd' }, { base: 'funfair' }, { base: 'compound-governance-token' }, { base: 'decentraland' }, { base: 'dai' }, { base: 'harmony' }, { base: 'injective-protocol' }, { base: 'bytom' }, { base: 'band-protocol' }, { base: 'nucypher' }, { base: 'kyber-network' }, { base: 'badger-dao' }, { base: 'mask-network' }, { base: 'civic' }, { base: 'icon' }, { base: 'bluzella' }, { base: 'kava' }, { base: 'serum' }, { base: 'ravencoin' }, { base: 'arpachain' }, { base: 'zkswap' }, { base: 'mirror-protocol' }, { base: 'linear' }, { base: 'storj' }, { base: 'swipe' }, { base: 'uma' } ] },
  { id: 'bitstamp', url: 'https://www.bitstamp.net', trade_url: 'https://www.bitstamp.net/markets/{base}/{target}', default_target: 'usd', support_pairs: [{ base: 'bitcoin' }, { base: 'ethereum' }, { base: 'usd-coin' }, { base: 'ripple' }, { base: 'chainlink' }, { base: 'litecoin' }, { base: 'dai' }, { base: 'bitcoin-cash' }, { base: 'stellar' }, { base: 'litecoin' }, { base: '0x' }, { base: 'omisego' }, { base: 'audius' }, { base: 'aave' }, { base: 'uniswap' }, { base: 'yearn-finance' }, { base: 'havven' }, { base: 'basic-attention-token' }, { base: 'algorand' }, { base: 'curve-dao-token' }, { base: 'kyber-network' }, { base: 'paxos-standard' }, { base: 'uma' } ] },
  { id: 'bitrue', url: 'https://www.bitrue.com', trade_url: 'https://www.bitrue.com/trade/{base}_{target}', default_target: 'usdt', support_pairs: [{ base: 'bitcoin' }, { base: 'ethereum' }, { base: 'ripple' }, { base: 'usd-coin' }, { base: 'vechain' }, { base: 'cardano' }, { base: 'bitcoin-cash' }, { base: 'stellar' }, { base: 'ethereum-classic' }, { base: 'theta-token' }, { base: 'litecoin' }, { base: 'solana' }, { base: 'true-usd' }, { base: 'monero' }, { base: 'wrapped-bitcoin' }, { base: 'neo' }, { base: 'paxos-standard' }, { base: 'matic-network' }, { base: 'eos' }, { base: 'tron' }, { base: 'zilliqa' }, { base: 'shiba-inu' }, { base: 'tezos' }, { base: 'dodo' }, { base: 'ravencoin' }, { base: 'basic-attention-token' }, { base: 'iostoken' }, { base: 'chainlink' }, { base: 'the-sandbox' }, { base: 'dash' }, { base: 'aave' }, { base: 'chiliz' }, { base: 'pundi-x-2' }, { base: 'iota' }, { base: 'kyber-network' }, { base: 'yearn-finance' }, { base: 'district0x' }, { base: 'dogecoin' }, { base: 'binancecoin' }, { base: 'alpha-finance' }, { base: 'hedera-hashgraph' }, { base: 'the-graph' }, { base: 'sushi' }, { base: 'holotoken' }, { base: 'axie-infinity' }, { base: '0x' }, { base: 'gitcoin' }, { base: 'terra-luna' }, { base: 'wanchain' }, { base: 'pancakeswap-token' }, { base: 'gas' }, { base: 'polkadot' } ] },
]

export const trades = (token, tokens, tickers = []) => {
  let data
  const { id, symbol, default_target } = { ...token }
  if (id) {
    data = _.orderBy(custom_trades.map(e => {
      let tickers_urls = tickers.filter(t => t?.market?.identifier === e?.id && t.trade_url && t.base && equals_ignore_case(t.base, symbol))
      tickers_urls = tickers_urls.findIndex(t => equals_ignore_case(t?.target, default_target)) > -1 ?
        tickers_urls.filter(t => equals_ignore_case(t?.target, default_target)) : tickers_urls
      return {
        exchange: tokens?.exchanges?.find(_e => _e?.id === e?.id) || e,
        url: affiliate_links(
          e.support_pairs.findIndex(c => c?.base === id) > -1 ?
            e.trade_url.replace('{base}', e.isUpperCase ? (symbol || id).toUpperCase() : (symbol || id).toLowerCase())
              .replace('{target}', e.isUpperCase ? e.default_target?.toUpperCase() : e.default_target?.toLowerCase()) :
            (tickers_urls[0]?.trade_url || e.url)
        ),
        match: e.support_pairs.findIndex(c => c?.base === id) > -1,
      }
    }), ['match'], ['desc'])
  }
  return data || []
}