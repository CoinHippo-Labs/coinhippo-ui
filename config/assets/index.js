export default {
  mainnet: [

  ],
  testnet: [
    {
      id: 'uaxl',
      name: 'Axelar',
      symbol: 'AXL',
      decimals: 6,
      image: '/logos/assets/axl.png',
      contracts: {
        ethereum: {
          address: '0x23ee2343B892b1BB63503a4FAbc840E0e2C6810f',
          symbol: 'wAXL',
        },
        polygon: {
          address: '0x9c79782d2B13CAC0Fa2FB00D188104fe6f98E533',
          symbol: 'wAXL',
        },
        avalanche: {
          address: '0xa8B51e6517f9A6Ab7b247bF10b71b1A738eD8E50',
          symbol: 'wAXL',
        },
        moonbeam: {
          address: '0xB4D56B6AD4DD2B48e68D2a26C25A04dC1c0eE393',
          symbol: 'wAXL',
        },
        axelarnet: {
          address: 'uaxl',
        },
        osmosis: {
          address: 'ibc/4DAB44738E392E8FDEC30F0EF3BED40D6EAA424B2666316B02307300B3A29B15',
        },
      },
    },
    {
      id: 'uausdc',
      name: 'USD Coin',
      symbol: 'aUSDC',
      decimals: 6,
      image: '/logos/assets/usdc.png',
      contracts: {
        ethereum: {
          address: '0x254d06f33bDc5b8ee05b2ea472107E300226659A',
        },
        polygon: {
          address: '0x2c852e740B62308c46DD29B982FBb650D063Bd07',
          symbol: 'axlUSDC',
        },
        avalanche: {
          address: '0x57F1c63497AEe0bE305B8852b354CEc793da43bB',
          symbol: 'axlUSDC',
        },
        moonbeam: {
          address: '0xD1633F7Fb3d716643125d6415d4177bC36b7186b',
          symbol: 'axlUSDC',
        },
        axelarnet: {
          address: 'uausdc',
          symbol: 'axlUSDC',
        },
        osmosis: {
          address: 'ibc/75C8E3091D507A5A111C652F9C76C2E53059E24759A98B523723E02FA33EEF51',
          symbol: 'axlUSDC',
        },
        kujira: {
          address: 'ibc/F91EA2C0A23697A1048E08C2F787E3A58AC6F706A1CD2257A504925158CFC0F3',
          symbol: 'axlUSDC',
        },
        sei: {
          address: 'ibc/6D45A5CD1AADE4B527E459025AC1A5AEF41AE99091EF3069F3FEAACAFCECCD21',
          symbol: 'axlUSDC',
        },
        fetch: {
          address: 'ibc/56FBD5B47B58A7302F6BED46F8702907E3619F2DC23DCEA8D6685064D79394F8',
          symbol: 'axlUSDC',
        },
      },
    },
  ],
}