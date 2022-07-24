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
import * as actions from './release-actions';
import fuLogger from '../../core/common/fu-logger';
import ReleaseView from '../../memberView/pm_release/release-view';
import ReleaseModifyView from '../../memberView/pm_release/release-modify-view';
import BaseContainer from '../../core/container/base-container';

function PMReleaseContainer({location,navigate}) {
	const itemState = useSelector((state) => state.pmrelease);
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
		BaseContainer.onSave({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,form:"PM_RELEASE_FORM"});
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
	const onBlur = (field) => {
		BaseContainer.onBlur({state:itemState,actions:actions,dispatch:dispatch,field});
	}
	
	const onOption = (code, item) => {
		fuLogger.log({level:'TRACE',loc:'ReleaseContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase({state:itemState,actions:actions,dispatch:dispatch,code:code,appPrefs:appPrefs,item:item})) {
			return;
		}
		let newPath = location.pathname.substr(0, location.pathname.lastIndexOf("/"));
		switch(code) {
			case 'DEFECT': {
				newPath = newPath + "/pm-defect";
				navigate(newPath,{state:{parent:item,parentType:"RELEASE"}});
				break;
			}
			case 'ENHANCEMENT': {
				newPath = newPath + "/pm-enhancement";
				navigate(newPath,{state:{parent:item,parentType:"RELEASE"}});
				break;
			}
			case 'SHARE': {
				newPath = newPath + "/pm-team";
				navigate(newPath,{state:{parent:item,parentType:"RELEASE"}});
				break;
			}
			case 'SCRUM': {
				newPath = newPath + "/pm-scrum";
				navigate(newPath,{state:{parent:item,parentType:"RELEASE"}});
				break;
			}
		}
	}
	
	


	fuLogger.log({level:'TRACE',loc:'ReleaseContainer::render',msg:"Hi there"});
	if (itemState.view == "MODIFY") {
		return (
			<ReleaseModifyView
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onSave}
			onCancel={onCancel}
			inputChange={inputChange}
			onBlur={onBlur}/>
		);
	} else if (itemState.view == "MAIN" && itemState.items != null) {
		return (
			<ReleaseView
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


export default PMReleaseContainer;
