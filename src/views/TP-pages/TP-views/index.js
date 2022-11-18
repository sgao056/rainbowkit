import React, { Suspense } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

const Holders = React.lazy(() =>
  import('./OwnerPages/Holders')
);

const Portal = React.lazy(() =>
  import('./OwnerPages/Portal')
);
const NFTWidget = React.lazy(() =>
  import('./NFT-Widget')
);
const Rewards = React.lazy(() =>
  import('./OwnerPages/Rewards')
);
const Data = React.lazy(() =>
  import('./OwnerPages/Data')
);
const AirDrop = React.lazy(() =>
  import('./OwnerPages/AirDrop')
);
const Mint = React.lazy(() =>
  import('./OwnerPages/Mint')
);
const ModifyContract = React.lazy(() =>
  import('./OwnerPages/ModifyContract')
);

const TPViews = () => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path="/owner/portal"
        render={() => <Portal  />}
      />
      <Route
      path="/owner/nft-widget"
      render={() => <NFTWidget  />}
      />
      <Route
        path="/owner/holders"
        render={() => <Holders  />}
      />
      <Route
        path="/owner/rewards"
        render={() => <Rewards  />}
      />
      <Route
        path="/owner/data"
        render={() => <Data  />}
      />
      <Route
        path="/owner/air-drop"
        render={() => <AirDrop  />}
      />
      <Route
        path="/owner/mint"
        render={() => <Mint  />}
      />
      <Route
        path="/owner/modify-contract"
        render={() => <ModifyContract  />}
      />
      <Redirect exact from="/owner" to="/owner/portal" />
    </Switch>
  </Suspense>
);
export default withRouter(TPViews);
