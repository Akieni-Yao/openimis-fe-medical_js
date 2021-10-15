import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { historyPush, withModulesManager, withHistory, withTooltip, formatMessage } from "@openimis/fe-core";
import { RIGHT_MEDICALITEMS_ADD } from "../constants";
import MedicalItemSearcher from "../components/MedicalItemSearcher";

const styles = (theme) => ({
  page: theme.page,
  fab: theme.fab,
});

class MedicalItemsPage extends Component {
  componentDidMount() {
    document.title = formatMessage(this.props.intl, "medical.item", "itemsTitle");
  }

  onDoubleClick = (ms, newTab = false) => {
    historyPush(this.props.modulesManager, this.props.history, "medical.medicalItemOverview", [ms.uuid], newTab);
  };

  onAdd = () => {
    historyPush(this.props.modulesManager, this.props.history, "medical.medicalItemNew");
  };

  render() {
    const { classes, rights, intl } = this.props;
    return (
      <div className={classes.page}>
        <MedicalItemSearcher cacheFiltersKey="medicalItemsPageFiltersCache" onDoubleClick={this.onDoubleClick} />
        {rights.includes(RIGHT_MEDICALITEMS_ADD) &&
          withTooltip(
            <div className={classes.fab}>
              <Fab color="primary" onClick={this.onAdd}>
                <AddIcon />
              </Fab>
            </div>,
            formatMessage(intl, "medical.medicalItem", "medical.addNewMedicalItem.tooltip"),
          )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
});

export default injectIntl(
  withModulesManager(withHistory(connect(mapStateToProps)(withTheme(withStyles(styles)(MedicalItemsPage))))),
);