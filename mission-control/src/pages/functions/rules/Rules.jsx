import React, { useState } from 'react';
import { connect } from 'react-redux';
import '../../../index.css';
import Sidenav from '../../../components/sidenav/Sidenav';
import Topbar from '../../../components/topbar/Topbar';
import Header from '../../../components/header/Header';
import Documentation from '../../../components/documentation/Documentation';
import EmptyState from '../../../components/rules/EmptyState';
import rulesImg from '../../../assets/rules.svg';
import RulesComponent from '../../../components/rules/Rules';
import EditItemModal from "../../../components/edit-item-modal/EditItemModal";
import projectId from '../../../assets/projectId.svg'
import { get, set } from "automate-redux";
import store from "../../../store"

const Rules = (props) => {
	const [modalVisible, setModalVisibility] = useState(false)
	const noOfRules = Object.keys(props.rules).length
	console.log("No of rules", noOfRules)
	return (
		<div>
			<Topbar showProjectSelector />
			<div className="flex-box">
				<Sidenav selectedItem="functions" />
				<div className="page-content">
					<div className="header-flex">
						<Header name="Rules" color="#000" fontSize="22px" />
						<Documentation url="https://spaceuptech.com/docs/functions" />
					</div>
					{noOfRules > 0 && <RulesComponent
						rules={props.rules}
						handleRuleChange={props.handleRuleChange}
						addText={'Add a rule'}
						handleAddRuleClick={() => setModalVisibility(true)}
						handleDeleteRule={props.handleDeleteRule}
					/>}
					{!noOfRules && <EmptyState
						graphics={rulesImg} desc="Guard your data with rules that define who has access to it and how it is structured."
						buttonText="Add a service"
						handleClick={() => setModalVisibility(true)} />}
					<EditItemModal graphics={projectId} heading="Service name" name="Give a service name" desc="This name is to identify a service" placeholder="Enter a service name" visible={modalVisible} handleCancel={() => setModalVisibility(false)} handleSubmit={props.handleCreateRule} />
				</div>
			</div>
		</div>
	);
}

const mapStateToProps = (state, ownProps) => {
	return {
		rules: get(state, `config.modules.functions.rules`, {}),
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleRuleChange: (ruleName, value) => {
			dispatch(set(`config.modules.functions.rules.${ruleName}`, value))
		},
		handleDeleteRule: (ruleName) => {
			const rules = Object.assign({}, get(store.getState(), `config.modules.functions.rules`))
			delete rules[ruleName]
			dispatch(set(`config.modules.functions.rules`, rules))
		},
		handleCreateRule: (ruleName) => {
			const defaultRule = {
				function1: {
					rule: "allow"
				}
			}
			dispatch(set(`config.modules.functions.rules.${ruleName}`, JSON.stringify(defaultRule, null, 2)))
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Rules);
