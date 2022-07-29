/*
 * Copyright (C) 2016 The ToastHub Project
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
import * as actions from './team-actions';
import fuLogger from '../../../core/common/fu-logger';
import PMTeamView from '../../../memberView/pm/team/team-view';
import PMTeamModifyView from '../../../memberView/pm/team/team-modify-view';
import PMTeamLinkModifyView from '../../../memberView/pm/team/team-link-modify-view';
import utils from '../../../core/common/utils';
import BaseContainer from '../../../core/container/base-container';


function PMTeamContainer({location,navigate}) {
	const itemState = useSelector((state) => state.pmteam);
	const session = useSelector((state) => state.session);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	
	useEffect(() => {
		if (location.state != null && location.state.parent != null) {
			dispatch(actions.init({parent:location.state.parent,parentType:location.state.parentType}));
		} else {
			dispatch(actions.init({}));
		}
	}, []);
	
	const onListLimitChange = (fieldName,event) => {
		BaseContainer.onListLimitChange({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,fieldName,event});
	}
	const onPaginationClick = (value) => {
		BaseContainer.onPaginationClick({state:itemState,actions:actions,dispatch:dispatch,value});
	}
	const onSearchChange = (field,event) => {
		BaseContainer.onSearchChange({state:itemState,actions:actions,dispatch:dispatchPM_ROLE,field,event});
	}
	const onSearchClick = (field,event) => {
		BaseContainer.onSearchClick({state:itemState,actions:actions,dispatch:dispatch,field,event});
	}
	const inputChange = (type,field,value,event) => {
		BaseContainer.inputChange({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,type,field,value,event});
	}
	const onOrderBy = (field, event) => {
		BaseContainer.onOrderBy({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,field,event});
	}
	const onSave = () => {
		BaseContainer.onSave({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,form:"PM_TEAM_FORM"});
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
	
	const onTeamLinkSave = () => {
		fuLogger.log({level:'TRACE',loc:'PMTeamContainer::onTeamLinkSave',msg:"test"});
		let errors = utils.validateFormFields(itemState.prefForms.PM_TEAM_PRODUCT_FORM,itemState.inputFields, appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			dispatch(actions.saveTeamLink({state:itemState}));
		} else {
			dispatch(actions.setErrors({errors:errors.errorMap}));
		}
	}
	
	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PMTeamContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase({state:itemState,actions:actions,dispatch:dispatch,code:code,appPrefs:appPrefs,item:item})) {
			return;
		}
		let newPath = location.pathname.substr(0, location.pathname.lastIndexOf("/"));
		switch(code) {
			case 'MEMBERS': {
				newPath = newPath + "/pm-member";
				navigate(newPath,{state:{parent:item,parentType:"TEAM"}});
				break;
			}
			case 'ROLES': {
				newPath = newPath + "/pm-role";
				navigate(newPath,{state:{parent:item,parentType:"TEAM"}});
				break;
			}
			case 'MODIFY_LINK': {
				if (item.productTeam != null) {
				dispatch(actions.modifyTeamLink({item,parentType:itemState.parentType,appPrefs:appPrefs}));
			} else {
				dispatch(actions.modifyTeamLink({item,parentType:itemState.parentType,appPrefs:appPrefs}));
			}
				break;
			}
		}
	}
	
	fuLogger.log({level:'TRACE',loc:'PMTeamContainer::render',msg:"Hi there"});
	if (itemState.view == "MODIFY") {
		return (
			<PMTeamModifyView
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onSave}
			onCancel={onCancel}
			inputChange={inputChange}/>
		);
	} else if (itemState.view == "TEAM_LINK_MODIFY") {
		return (
			<PMTeamLinkModifyView
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onTeamLinkSave}
			onCancel={onCancel}
			inputChange={inputChange}/>
		);
	} else if (itemState.view == "MAIN" && itemState.items != null) {
		return (
			<PMTeamView 
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

export default PMTeamContainer;
