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
import reducerUtils from '../../../core/common/reducer-utils';

export default function testScriptReducer(state = {}, action) {
	let myState = {};
	switch(action.type) {
		case 'PM_TESTSCRIPT_INIT': {
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
					paginationSegment: 1,
					orderCriteria: [],
    				searchCriteria: [{'searchValue':'','searchColumn':'PM_TESTSCRIPT_TABLE_NAME'}],
					selected: null,
					view: "MAIN",
					pageName:"PMTESTSCRIPT",
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
		case 'PM_TESTSCRIPT_LIST': {
			if (action.responseJson != null && action.responseJson.params != null) {
				return Object.assign({}, state, {
					itemCount: reducerUtils.getItemCount(action),
					items: reducerUtils.getItems(action),
					listLimit: reducerUtils.getListLimit(action),
					listStart: reducerUtils.getListStart(action),
					paginationSegment: action.paginationSegment,
					selected: null,
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
		case 'PM_TESTSCRIPT_ITEM': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let prefForms = reducerUtils.getPrefForms(action);
				for (let i = 0; i < prefForms.PM_TESTSCRIPT_FORM.length; i++) {
					if (prefForms.PM_TESTSCRIPT_FORM[i].group === "FORM1") {
						let classModel = JSON.parse(prefForms.PM_TESTSCRIPT_FORM[i].classModel);
						if (action.responseJson.params.item != null && action.responseJson.params.item[classModel.field]) {
							inputFields[prefForms.PM_TESTSCRIPT_FORM[i].name] = action.responseJson.params.item[classModel.field];
						} else {
							let result = "";
							if (prefForms.PM_TESTSCRIPT_FORM[i].value != null && prefForms.PM_TESTSCRIPT_FORM[i].value != ""){
								let formValue = JSON.parse(prefForms.PM_TESTSCRIPT_FORM[i].value);
								if (formValue.options != null) {
									for (let j = 0; j < formValue.options.length; j++) {
										if (formValue.options[j] != null && formValue.options[j].defaultInd == true){
											result = formValue.options[j].value;
										}
									}
								} else if (formValue.referPref != null) {
									let pref = action.appPrefs.prefTexts[formValue.referPref.prefName][formValue.referPref.prefItem];
									if (pref != null && pref.value != null && pref.value != "") {
										let value = JSON.parse(pref.value);
										if (value.options != null) {
											for (let j = 0; j < value.options.length; j++) {
												if (value.options[j] != null && value.options[j].defaultInd == true){
													result = value.options[j].value;
												}
											}
										}
									}
								}
							}
							inputFields[prefForms.PM_TESTSCRIPT_FORM[i].name] = result;
						}
					}
				}
				// add id if this is existing item
				if (action.responseJson.params.item != null) {
					inputFields.itemId = action.responseJson.params.item.id;
				}
				return Object.assign({}, state, {
					prefForms: Object.assign({}, state.prefForms, reducerUtils.getPrefForms(action)),
					selected : action.responseJson.params.item,
					inputFields : inputFields,
					view: "MODIFY"
				});
			} else {
				return state;
			}
		}
		case 'PM_TESTSCRIPT_INPUT_CHANGE': {
			return reducerUtils.updateInputChange(state,action);
		}
		case 'PM_TESTSCRIPT_SELECT_CHANGE': {
			if (action.params != null) {
				let inputFields = Object.assign({}, state.inputFields);
				inputFields[action.params.field] = action.params.value;
				
				let clone = Object.assign({}, state);
				clone.inputFields = inputFields;
				return clone;
			} else {
		        return state;
		    }
		}
		case 'PM_TESTSCRIPT_CLEAR_FIELD': {
			return reducerUtils.updateClearField(state,action);
		}
		case 'PM_TESTSCRIPT_LISTLIMIT': {
			return reducerUtils.updateListLimit(state,action);
		}
		case 'PM_TESTSCRIPT_SEARCH': { 
			return reducerUtils.updateSearch(state,action);
		}
		case 'PM_TESTSCRIPT_ORDERBY': { 
			return reducerUtils.updateOrderBy(state,action);
		}
		case 'PM_TESTSCRIPT_ADD_PARENT': {
			if (action.parent != null) {
				return Object.assign({}, state, {
					parent: action.parent,
					parentType: action.parentType
				});
			} else {
		        return state;
		    }
		}
		case 'PM_TESTSCRIPT_CLEAR_PARENT': {
			return Object.assign({}, state, {
				parent: null,
				parentType: null
			});
		}
		case 'PM_TESTSCRIPT_MOVE_SELECT': {
			if (action.item != null) {
				return Object.assign({}, state, {
					moveSelectedItem: action.item
				});
			} else {
		        return state;
		    }
		}
		case 'PM_TESTSCRIPT_MOVE_CANCEL': {
			return Object.assign({}, state, {
				moveSelectedItem: null
			});
		}
		case 'PM_TESTSCRIPT_SET_ERRORS': {
			return Object.assign({}, state, {
				errors: action.errors
			});
		}
		case 'PM_TESTSCRIPT_CLOSE_DELETE_MODAL': {
			return Object.assign({}, state, {
				isDeleteModalOpen: false
			});
		}
		case 'PM_TESTSCRIPT_OPEN_DELETE_MODAL': {
			return Object.assign({}, state, {
				isDeleteModalOpen: true,
				selected: action.item
			});
		}
		case 'PM_TESTSCRIPT_CANCEL': {
			return Object.assign({}, state, {
				view: "MAIN",
				selected:null,
				inputFields:null
			});
		}
		default:
			return state;
	}
}


