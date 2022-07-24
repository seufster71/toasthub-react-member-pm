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
import reducerUtils from '../../core/common/reducer-utils';

export default function deployReducer(state = {}, action) {
	switch(action.type) {
		case 'PM_DEPLOY_INIT': {
			if (action.responseJson != null && action.responseJson.params != null) {
				return Object.assign({}, state, {
					prefTexts: Object.assign({}, state.prefTexts, reducerUtils.getPrefTexts(action)),
					prefLabels: Object.assign({}, state.prefLabels, reducerUtils.getPrefLabels(action)),
					prefOptions: Object.assign({}, state.prefOptions, reducerUtils.getPrefOptions(action)),
					columns: reducerUtils.getColumns(action),
					itemCount: reducerUtils.getItemCount(action),
					items: reducerUtils.getItems(action),
					listLimit: reducerUtils.getListLimit(action),
					listStart: reducerUtils.getListStart(action),
					orderCriteria: [{'orderColumn':'PM_DEPLOY_TABLE_NAME','orderDir':'ASC'}],
    				searchCriteria: [{'searchValue':'','searchColumn':'PM_DEPLOY_TABLE_NAME'}],
    				paginationSegment: 1,
					selected: null,
					inputFields:null,
					view: "MAIN",
					pageName:"PMDEPLOY",
					isDeleteModalOpen: false,
					errors:null, 
					warns:null, 
					successes:null,
					searchValue:""
				});
			} else {
				return state;
			}
		}
		case 'PM_DEPLOY_LIST': {
			if (action.responseJson != null && action.responseJson.params != null) {
				return Object.assign({}, state, {
					itemCount: reducerUtils.getItemCount(action),
					items: reducerUtils.getItems(action),
					listLimit: reducerUtils.getListLimit(action),
					listStart: reducerUtils.getListStart(action),
					paginationSegment: action.paginationSegment,
					selected: null,
					inputFields:null,
					view: "MAIN",
					isDeleteModalOpen: false,
					errors:null, 
					warns:null, 
					successes:null
				});
			} else {
				return state;
			}
		}
		case 'PM_DEPLOY_ITEM': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let prefForms = reducerUtils.getPrefForms(action);
				let form = prefForms.PM_DEPLOY_FORM;
				
				inputFields = reducerUtils.loadInputFields(action.responseJson.params.item,form,inputFields,action.appPrefs,"FORM1");
				
				// add id if this is existing item
				if (action.responseJson.params.item != null) {
					inputFields.itemId = action.responseJson.params.item.id;
				} else {
					inputFields.itemId = null;
				}
				let view = "MODIFY";
				if (action.view != null) {
					view = action.view;
				}
				
				return Object.assign({}, state, {
					prefForms: Object.assign({}, state.prefForms, reducerUtils.getPrefForms(action)),
					selected : action.responseJson.params.item,
					inputFields : inputFields,
					view: view
				});
			} else {
				return state;
			}
		}
		case 'PM_DEPLOY_INPUT_CHANGE': {
			return reducerUtils.updateInputChange(state,action);
		}
		case 'PM_DEPLOY_CLEAR_FIELD': {
			return reducerUtils.updateClearField(state,action);
		}
		case 'PM_DEPLOY_LISTLIMIT': {
			return reducerUtils.updateListLimit(state,action);
		}
		case 'PM_DEPLOY_SEARCH': { 
			return reducerUtils.updateSearch(state,action);
		}
		case 'PM_DEPLOY_SEARCH_CHANGE': { 
			return reducerUtils.updateSearchChange(state,action);
		}
		case 'PM_DEPLOY_ORDERBY': { 
			return reducerUtils.updateOrderBy(state,action);
		}
		case 'PM_DEPLOY_SET_STATUS': {
			reducerUtils.updateStatus(state,action);
		}
		case 'PM_DEPLOY_CLOSE_DELETE_MODAL': {
			return Object.assign({}, state, {
				isDeleteModalOpen: false
			});
		}
		case 'PM_DEPLOY_OPEN_DELETE_MODAL': {
			return Object.assign({}, state, {
				isDeleteModalOpen: true,
				selected: action.item
			});
		}
		case 'PM_DEPLOY_CANCEL': {
			return Object.assign({}, state, {
				view: "MAIN",
				selected:null,
				inputFields:null
			});
		}
		case 'PM_DEPLOY_TEST_SSH': {
			if (action.responseJson != null && action.responseJson.params != null) {
				let inputFields = Object.assign({}, state.inputFields);
				inputFields.sshTest = action.responseJson.params.sshTest;
				let clone = Object.assign({}, state);
				clone.inputFields = inputFields;
				return clone;
			} else {
				return state;
			}
		}
		case 'PM_DEPLOY_TEST_SCM': {
			if (action.responseJson != null && action.responseJson.params != null) {
				let inputFields = Object.assign({}, state.inputFields);
				inputFields.scmTest = action.responseJson.params.scmTest;
				let clone = Object.assign({}, state);
				clone.inputFields = inputFields;
				return clone;
			} else {
				return state;
			}
		}
		default:
			return state;
	}
}


