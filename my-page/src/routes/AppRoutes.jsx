import { Fragment } from 'react';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';

const AppRoutes = () => {
  return (
    <Fragment>
      <PublicRoutes />
      <PrivateRoutes />
    </Fragment>
  );
};

export default AppRoutes;
