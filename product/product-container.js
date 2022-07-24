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
import * as actions from './product-actions';
import fuLogger from '../../core/common/fu-logger';
import ProductView from '../../memberView/pm_product/product-view';
import ProductModifyView from '../../memberView/pm_product/product-modify-view';
import BaseContainer from '../../core/container/base-container';


function PMProductContainer({location,navigate}) {
	const itemState = useSelector((state) => state.pmproduct);
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
		BaseContainer.onSave({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,form:"PM_PRODUCT_FORM"});
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
		fuLogger.log({level:'TRACE',loc:'ProductContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase({state:itemState,actions:actions,dispatch:dispatch,code:code,appPrefs:appPrefs,item:item})) {
			return;
		}
		let newPath = location.pathname.substr(0, location.pathname.lastIndexOf("/"));
		switch(code) {
			case 'PROJECT': {
				newPath = newPath + "/pm-project";
				navigate(newPath,{state:{parent:item,parentType:"PRODUCT"}});
				break;
			}
			case 'RELEASE': {
				newPath = newPath + "/pm-release";
				navigate(newPath,{state:{parent:item,parentType:"PRODUCT"}});
				break;
			}
			case 'BACKLOG': {
				newPath = newPath + "/pm-backlog";
				navigate(newPath,{state:{parent:item,parentType:"PRODUCT"}});
				break;
			}
			case 'DEFECT': {
				newPath = newPath + "/pm-defect";
				navigate(newPath,{state:{parent:item,parentType:"PRODUCT"}});
				break;
			}
			case 'ENHANCEMENT': {
				newPath = newPath + "/pm-enhancement";
				navigate(newPath,{state:{parent:item,parentType:"PRODUCT"}});
				break;
			}
			case 'SHARE': {
				newPath = newPath + "/pm-team";
				navigate(newPath,{state:{parent:item,parentType:"PRODUCT"}});
				break;
			}
			case 'SCRUM': {
				newPath = newPath + "/pm-scrum";
				navigate(newPath,{state:{parent:item,parentType:"PRODUCT"}});
				break;
			}
			case 'WORKFLOW': {
				newPath = newPath + "/pm-workflow";
				navigate(newPath,{state:{parent:item,parentType:"PRODUCT"}});
				break;
			}
		}
	}

	fuLogger.log({level:'TRACE',loc:'ProductContainer::render',msg:"Hi there"});
	if (itemState.view == "MODIFY") {
		return (
			<ProductModifyView
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onSave}
			onCancel={onCancel}
			inputChange={inputChange}
			onBlur={onBlur}/>
		);
	} else if (itemState.view == "MAIN" && itemState.items != null) {
		return (
			<ProductView
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

export default PMProductContainer;
