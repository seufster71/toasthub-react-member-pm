/*
 * Copyright (C) 2020 The ToastHub Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use-strict';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from './workflowstep-actions';
import fuLogger from '../../core/common/fu-logger';
import WorkflowStepView from '../../memberView/pm_workflow/workflowstep-view';
import WorkflowStepModifyView from '../../memberView/pm_workflow/workflowstep-modify-view';
import BaseContainer from '../../core/container/base-container';


function PMWorkflowStepContainer({location,navigate}) {
	const itemState = useSelector((state) => state.pmworkflowstep);
	const session = useSelector((state) => state.session);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	
	useEffect(() => {
		if (location.state != null && location.state.parent != null) {
			dispatch(actions.init(location.state.parent,location.state.parentType));
		} else {
			dispatch(actions.init());
		}
	}, []);

	const onListLimitChange = (fieldName,event) => {
		BaseContainer.onListLimitChange({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,fieldName,event});
	}
	const onPaginationClick = (value) => {
		BaseContainer.onPaginationClick({state:itemState,actions:actions,dispatch:dispatch,value});
	}
	const onSearchChange = (field,event) => {
		BaseContainer.onSearchChange({state:itemState,actions:actions,dispatch:dispatch,field,event});
	}
	const onSearchClick = (fieldName,event) => {
		BaseContainer.onSearchClick({state:itemState,actions:actions,dispatch:dispatch,fieldName,event});
	}
	const inputChange = (type,field,value,event) => {
		BaseContainer.inputChange({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,type,field,value,event});
	}
	const onOrderBy = (selectedOption, event) => {
		BaseContainer.onOrderBy({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,selectedOption,event});
	}
	const onSave = () => {
		BaseContainer.onSave({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,form:"PM_WORKFLOW_STEP_FORM"});
	}
	const closeModal = () => {
		BaseContainer.closeModal({actions:actions,dispatch:dispatch});
	}
	const onCancel = () => {
		BaseContainer.onCancel({state:itemState,actions:actions,dispatch:dispatch});
	}
	const goBack = () => {
		BaseContainer.goBack({navigate});
	}
	
	const onMoveSelect = (item) => {
		fuLogger.log({level:'TRACE',loc:'WorkflowStepContainer::onMoveSelect',msg:"test"});
		if (item != null) {
			dispatch(actions.moveSelect({state:itemState,item}));
		}
	}
	
	const onMoveSave = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'WorkflowStepContainer::onMoveSave',msg:"test"});
		if (item != null) {
			dispatch(actions.moveSave({state:itemState,code,item}));
		}
	}
	
	const onMoveCancel = () => {
		fuLogger.log({level:'TRACE',loc:'WorkflowStepContainer::onMoveCancel',msg:"test"});
		dispatch(actions.moveCancel({state:itemState}));
	}
	
	const onOption = (code, item) => {
		fuLogger.log({level:'TRACE',loc:'WorkflowStepContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase({state:itemState,actions:actions,dispatch:dispatch,code:code,appPrefs:appPrefs,item:item})) {
			return;
		}
		
		switch(code) {
			case 'MOVESELECT': {
				onMoveSelect(item);
				break;
			}
			case 'MOVEABOVE': {
				onMoveSave(code,item);
				break;
			}
			case 'MOVEBELOW': {
				onMoveSave(code,item);
				break;
			}
			case 'MOVECANCEL': {
				onMoveCancel();
				break;
			}
		}
	}
	
	const selectChange = (selected,event) => {
		if (event.action == "remove-value") {
			dispatch(actions.selectChange("REMOVE",event.name,event.removedValue.value));
		} else if (event.action == "select-option" ) {
			dispatch(actions.selectChange("ADD",event.name,event.option.value));
		}
	}


	fuLogger.log({level:'TRACE',loc:'WorkflowStepContainer::render',msg:"Hi there"});
	if (itemState.isModifyOpen) {
		return (
			<WorkflowStepModifyView
			containerState={this.state}
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onSave}
			onCancel={onCancel}
			onReturn={onCancel}
			inputChange={inputChange}
			selectChange={selectChange}
			onBlur={onBlur}/>
		);
	} else if (itemState.items != null) {
		return (
			<WorkflowStepView
			containerState={this.state}
			itemState={itemState}
			appPrefs={appPrefs}
			onListLimitChange={onListLimitChange}
			onSearchChange={onSearchChange}
			onSearchClick={onSearchClick}
			onPaginationClick={onPaginationClick}
			onOrderBy={onOrderBy}
			closeModal={closeModal}
			onOption={onOption}
			inputChange={inputChange}
			goBack={goBack}
			session={session}
			/>
		);
	} else {
		return (<div> Loading... </div>);
	}

}

export default PMWorkflowStepContainer;
