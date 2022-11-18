import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { MoralisProvider } from "react-moralis";
import { Provider } from 'react-redux';
import { configureStore } from './redux/store';

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum, chain.goerli],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

// const client = createClient({
//   provider,
//   webSocketProvider,
//   autoConnect: true,
// });

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const App = React.lazy(() => import('./App'));

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

const Main = () => {
  return (
    // prettier-ignore-start
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <MoralisProvider 
          serverUrl={SERVER_URL} appId={APP_ID}
        >
          <Provider store={configureStore()}>
            <Suspense fallback={<div className="loading" />}>
              <App/>                        
            </Suspense>
          </Provider>
        </MoralisProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

ReactDOM.render(<Main />, document.getElementById('root'));