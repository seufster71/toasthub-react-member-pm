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
import * as actions from './role-actions';
import fuLogger from '../../core/common/fu-logger';
import PMRoleView from '../../memberView/pm_team/role-view';
import PMRoleModifyView from '../../memberView/pm_team/role-modify-view';
import PMMemberRolesModifyView from '../../memberView/pm_team/member-roles-modify-view';
import utils from '../../core/common/utils';
import BaseContainer from '../../core/container/base-container';


function PMRoleContainer({location,navigate}) {
	const itemState = useSelector((state) => state.pmrole);
	const session = useSelector((state) => state.session);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();

	useEffect(() => {
		if (location.state != null && location.state.parent != null) {
			dispatch(actions.init({parent:location.state.parent,parentType:location.state.parentType,teamId:location.state.teamId}));
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
		BaseContainer.onSearchChange({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,field,event});
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
		BaseContainer.onSave({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,form:"PM_TEAM_ROLE_FORM"});
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

	const onMemberRoleModify = (item) => {
		fuLogger.log({level:'TRACE',loc:'PMRoleContainer::onMemberRoleModify',msg:"test"+item.id});
		if (item.memberRole != null) {
			dispatch(actions.modifyMemberRole({role:item,appPrefs:appPrefs}));
		} else {
			dispatch(actions.modifyMemberRole({role:item,appPrefs:appPrefs}));
		}
	}
	
	const onTeamRoleModify = (item) => {
		fuLogger.log({level:'TRACE',loc:'PMRoleContainer::onTeamRoleModify',msg:"test"+item.id});
		if (item.memberRole != null) {
			dispatch(actions.modifyTeamRole({role:item,appPrefs:appPrefs}));
		} else {
			dispatch(actions.modifyTeamRole({role:item,appPrefs:appPrefs}));
		}
	}
	
	const onMemberRoleSave = () => {
		fuLogger.log({level:'TRACE',loc:'PMRoleContainer::onMemberRoleSave',msg:"test"});
		let errors = utils.validateFormFields(itemState.prefForms.PM_MEMBER_ROLE_FORM,itemState.inputFields, appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			dispatch(actions.saveMemberRole({state:itemState}));
		} else {
			dispatch(actions.setStatus({errors:errors.errorMap}));
		}
	}
	
	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PMRoleContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase({state:itemState,actions:actions,dispatch:dispatch,code:code,appPrefs:appPrefs,item:item})) {
			return;
		}
		let newPath = location.pathname.substr(0, location.pathname.lastIndexOf("/"));
		switch(code) {
			case 'MODIFY_MEMBER_ROLE': {
				onMemberRoleModify(item);
				break;
			}
			case 'MODIFY_TEAM_ROLE': {
				onTeamRoleModify(item);
				break;
			}
			case 'PERMISSIONS': {
				let parentName = "TEAM_ROLE";
				if(itemState.parentType == "MEMBER") {
					parentName = "MEMBER_ROLE";
				}
				newPath = newPath + "/pm-permission";
				navigate(newPath,{state:{parent:item,parentType:parentName}});
				break;
			}
		}
	}
	
	fuLogger.log({level:'TRACE',loc:'PMRoleContainer::render',msg:"Hi there"});
	if (itemState.view == "MODIFY") {
		return (
			<PMRoleModifyView
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onSave}
			onCancel={onCancel}
			inputChange={inputChange}/>
		);
	} else if (itemState.view == "MEMBER_ROLE_MODIFY") {
		return (
			<PMMemberRolesModifyView
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onMemberRoleSave}
			onCancel={onCancel}
			onReturn={onCancel}
			inputChange={inputChange}/>
		);
	} else if (itemState.view == "MAIN" && itemState.items != null) {
		return (
			<PMRoleView 
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


export default PMRoleContainer;
