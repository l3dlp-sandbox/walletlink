import { Container, VStack } from '@chakra-ui/react';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { getCryptoKeyAccount } from '@coinbase/wallet-sdk-crypto-key';
import React, { useEffect, useState } from 'react';
import { LocalAccount, OneOf } from 'viem';
import { WebAuthnAccount } from 'viem/account-abstraction';

import { AddAddress } from './components/AddAddress';
import { AddOwner } from './components/AddOwner';
import { Connect } from './components/Connect';
import { GenerateNewSigner } from './components/GenerateNewSigner';
import { PersonalSign } from './components/PersonalSign';
import { SendCalls } from './components/SendCalls';

export default function SubAccounts() {
  const [sdk, setSDK] = useState<ReturnType<typeof createCoinbaseWalletSDK>>();

  useEffect(() => {
    const sdk = createCoinbaseWalletSDK({
      appName: 'CryptoPlayground',
      preference: {
        keysUrl: 'http://localhost:3005/connect',
        options: 'smartWalletOnly',
      },
      subaccount: {
        getSigner: getCryptoKeyAccount as () => Promise<{
          account: OneOf<WebAuthnAccount | LocalAccount> | null;
        }>,
      },
    });

    if (!sdk) {
      return;
    }

    setSDK(sdk);
    const provider = sdk.getProvider();

    provider.on('accountsChanged', (accounts) => {
      console.info('customlogs: accountsChanged', accounts);
    });
  }, []);

  return (
    <Container mb={16}>
      <VStack w="full" spacing={4}>
        <Connect sdk={sdk} />
        <AddAddress sdk={sdk} />
        <PersonalSign sdk={sdk} />
        <SendCalls sdk={sdk} />
        <GenerateNewSigner />
        <AddOwner sdk={sdk} />
      </VStack>
    </Container>
  );
}
