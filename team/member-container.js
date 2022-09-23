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
import * as actions from './member-actions';
import fuLogger from '../../../core/common/fu-logger';
import PMMemberView from '../../../memberView/pm/team/member-view';
import PMMemberModifyView from '../../../memberView/pm/team/member-modify-view';
import utils from '../../../core/common/utils';
import BaseContainer from '../../../core/container/base-container';
import callService from '../../../core/api/api-call';


function PMMemberContainer({location,navigate}) {
	const itemState = useSelector((state) => state.pmmember);
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
		BaseContainer.onSave({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,form:"PM_MEMBER_FORM"});
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
	
	const onUserRoleSave = () => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::onUserRoleSave',msg:"test"});
		let errors = utils.validateFormFields(itemState.prefForms.ADMIN_USER_ROLE_FORM,itemState.inputFields, appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			//dispatch(memberActions.saveRolePermission({state:itemState}));
		} else {
			dispatch(actions.setErrors({errors:errors.errorMap}));
		}
	}
	
	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::onOption',msg:" code "+code});
		BaseContainer.onOptionBase({state:itemState,actions:actions,dispatch:dispatch,code:code,appPrefs:appPrefs,item:item})
		
		let newPath = location.pathname.substr(0, location.pathname.lastIndexOf("/"));
		switch(code) {
			case 'ROLES': {
				newPath = newPath + "/pm-role";
				navigate(newPath,{state:{parent:item,parentType:"MEMBER",teamId:itemState.parent.id}});
				break;
			}
			case 'MODIFY': {
				if (item != null) {
		//			dispatch(actions.getDefaultOptions({field:"PM_MEMBER_FORM_USERNAME",item:item}));
				}
			}
		}
	}
	
	const loadOptions = (inputValue,callback,name) => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::loadOptions',msg:" value "+inputValue});
		let requestParams = {};
	    requestParams.action = "SELECTLIST";
	    requestParams.service = "PM_MEMBER_SVC";
	    requestParams.fieldName = name;
	    requestParams.searchValue = inputValue;
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/member/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
				let list = [];
				if (responseJson.params.items != null) {
					let items = responseJson.params.items;
					for (let i = 0; i < items.length; i++) {
						let label = items[i].firstname + " " + items[i].middlename + " " + items[i].lastname;
						list.push({"label":label,"value":items[i].id, "extra":items[i].username});
					}
				}
	    		callback(list);
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	}
	
	fuLogger.log({level:'TRACE',loc:'PMMemberContainer::render',msg:"Hi there"});
	if (itemState.view == "MODIFY") {
		return (
			<PMMemberModifyView
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onSave}
			onCancel={onCancel}
			inputChange={inputChange}
			loadOptions={loadOptions}/>
		);
	} else if (itemState.view == "MAIN" && itemState.items != null) {
		return (
			<PMMemberView 
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

export default PMMemberContainer;
