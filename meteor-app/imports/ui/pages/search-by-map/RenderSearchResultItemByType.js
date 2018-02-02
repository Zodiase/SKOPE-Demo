import { Meteor } from 'meteor/meteor';
import React from 'react';
import objectPath from 'object-path';

import * as searchResultItemRenderers from './searchResultItemRenderers';

import UnknownTypeRenderer from './searchResultItemRenderers/unknown';

const resultTypeFieldPath = 'result._source.type';
const renderSearchResultItemsWithUnknownType = objectPath.get(Meteor.settings, 'public.renderSearchResultItemsWithUnknownType', false);
const renderInvalidSearchResultItems = objectPath.get(Meteor.settings, 'public.renderInvalidSearchResultItems', false);

export default (props) => {
  const resultItemType = objectPath.get(props, resultTypeFieldPath);

  if (!resultItemType) {
    if (renderInvalidSearchResultItems) {
      //! Use a dedicated component to show an invalid data error.
      return React.createElement(UnknownTypeRenderer, props);
    }

    return null;
  }

  const rendererName = `SEARCH_RESULT_ITEM__${resultItemType.toUpperCase()}`;

  if (!(rendererName in searchResultItemRenderers)) {
    if (renderSearchResultItemsWithUnknownType) {
      return React.createElement(UnknownTypeRenderer, props);
    }

    return null;
  }

  const Renderer = searchResultItemRenderers[rendererName];

  return React.createElement(Renderer, props);
};
