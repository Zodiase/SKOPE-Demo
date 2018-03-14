import React from 'react';
import Paper from 'material-ui/Paper';

import {
  DatasetDownloadIcon,
} from '/imports/ui/consts';

import {
  MarkDownRenderer,
} from '/imports/ui/helpers';

import TabComponentClass from './TabComponentClass';

export default
class DownloadTab extends TabComponentClass {
  static tabName = 'download';
  static tabIcon = DatasetDownloadIcon;
  static tabLabel = 'Download';
  static requiredProps = [
    'downloadService',
  ];

  renderBody () {
    const {
      downloadService: downloadField,
    } = this.props;

    return (
      <div className="dataset__download-tab">
        <Paper
          className="download__markdown"
          zDepth={1}
        >
          <MarkDownRenderer
            value={downloadField.markdown}
          />
        </Paper>
      </div>
    );
  }
}
