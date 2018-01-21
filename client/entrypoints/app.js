import React from 'react';
import { render } from 'react-dom';

import Main from 'components/main';
import withProviders from 'hocs/with_providers';

export default render(
  withProviders(() => <Main />)(),
  document.getElementById('app')
) 
