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
import * as actions from './deploy-actions';
import fuLogger from '../../core/common/fu-logger';
import DeployView from '../../memberView/pm_deploy/deploy-view';
import DeployModifyView from '../../memberView/pm_deploy/deploy-modify-view';
import BaseContainer from '../../core/container/base-container';


export default function PMDeployContainer({navigate,location}) {
	const itemState = useSelector((state) => state.pmdeploy);
	const session = useSelector((state) => state.session);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(actions.init({lang:session.selected.lang}));
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
	const onOrderBy = (field,event) => {
		BaseContainer.onOrderBy({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,field,event});
	}
	const onSave = () => {
		let form = "PM_DEPLOY_FORM";
		BaseContainer.onSave({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,form:form});
	}
	const closeModal = () => {
		BaseContainer.closeModal({actions:actions,dispatch:dispatch});
	}
	const onCancel = () => {
		BaseContainer.onCancel({state:itemState,actions:actions,dispatch:dispatch});
	}
	const onBlur = (field) => {
		BaseContainer.onCancel({state:itemState,actions:actions,dispatch:dispatch,field});
	}
	
	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'DeployContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase({state:itemState,actions:actions,dispatch:dispatch,code:code,appPrefs:appPrefs,item:item})) {
			return;
		}
		
		switch(code) {
			case 'SHARE': {
				navigate('/member/pm-team',{state:{parent:item,parentType:"DEPLOY"}});
				break;
			}
			case 'PIPELINE': {
				navigate('/member/pm-deploy/pm-deploypipeline',{state:{parent:item,parentType:"DEPLOY"}});
				break;
			}
			case 'SYSTEM': {
				navigate('/member/pm-deploy/pm-deploysystem',{state:{parent:item,parentType:"DEPLOY"}});
				break;
			}
			case 'BUILD': {
				//dispatch(actions.modifyItem({id:item.id,appPrefs,view:"SETTINGS"}));
				break;
			}
		}
	}
	
	const onClick = (code) => {
		fuLogger.log({level:'TRACE',loc:'DeployContainer::onClick',msg:" code "+code});
		switch(code) {
			case 'TESTSSH': {
				dispatch(actions.testSSH({state:itemState}));
				break;
			}
			case 'TESTSCM': {
				dispatch(actions.testSCM({state:itemState}));
				break;
			}
		}
	}

	fuLogger.log({level:'TRACE',loc:'DeployContainer::render',msg:"Hi there"});
	if (itemState.view == "MODIFY") {
		return (
			<DeployModifyView
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onSave}
			onCancel={onCancel}
			onClick={onClick}
			inputChange={inputChange}
			onBlur={onBlur}/>
		);
	} else if (itemState.view == "MAIN" && itemState.items != null) {
		return (
			<DeployView
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
			session={session}
			/>
		);
	} else {
		return (<div> Loading... </div>);
	}
}

