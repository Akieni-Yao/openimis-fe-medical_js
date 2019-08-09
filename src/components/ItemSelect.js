import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import { formatMessage, AutoSuggestion, withModulesManager } from "@openimis/fe-core";
import { fetchItems } from "../actions";
import _debounce from "lodash/debounce";

class ItemSelect extends Component {

    constructor(props) {
        super(props);
        this.cacheItems = props.modulesManager.getConfiguration("fe-medical", "cacheItems", true);
    }

    componentDidMount() {
        if (this.cacheItems && !this.props.items) {
            this.props.fetchItems();
        }
    }

    getSuggestions = i => this.props.fetchItems(i);

    debouncedGetSuggestion = _debounce(
        this.getSuggestions,
        this.props.modulesManager.getConfiguration("fe-medical", "debounceTime", 500)
    )

    onSuggestionSelected = v => this.props.onItemSelected(v);

    render() {
        const { intl, items } = this.props;
        return <AutoSuggestion
            items={items}
            placeholder={formatMessage(intl, "medical", "ItemSelect.placehoder")}
            lookup={i => i.code + i.name}
            getSuggestions={this.cacheItems ? null : this.debouncedGetSuggestion}
            renderSuggestion={i => <span>{i.code} {i.name}</span>}
            getSuggestionValue={i => `${i.code} ${i.name}`}
            onSuggestionSelected={this.onSuggestionSelected}
        />
    }
}

const mapStateToProps = state => ({
    items: state.medical.items,
    fetchingItems: state.medical.fetchingItems,
    fetchedItems: state.medical.fetchedItems,
    errorItems: state.medical.errorItems,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchItems }, dispatch);
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(
    withModulesManager(ItemSelect)));