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
import callService from '../../core/api/api-call';
import actionUtils from '../../core/common/action-utils';

// action helpers



// thunks
export function init({parent,parentType,lang}) {
  return function(dispatch) {
    let requestParams = {};
    requestParams.action = "INIT_PIPELINE";
    requestParams.service = "PM_DEPLOY_SVC";
    requestParams.prefTextKeys = new Array("PM_DEPLOY_PIPELINE_PAGE");
    requestParams.prefLabelKeys = new Array("PM_DEPLOY_PIPELINE_PAGE");
    requestParams.lang = lang;
    if (parent != null) {
    	if (parentType != null && parentType === "DEPLOY") {
    		requestParams.deployId = parent.id;
    	}
		dispatch({type:"PM_DEPLOY_PIPELINE_ADD_PARENT", parent, parentType});
	} else {
		dispatch({type:"PM_DEPLOY_PIPELINE_CLEAR_PARENT"});
	}
    let params = {};
    params.requestParams = requestParams;
    params.URI = '/api/member/callService';

    return callService(params).then( (responseJson) => {
    	if (responseJson != null && responseJson.protocalError == null){
    		dispatch({ type: "PM_DEPLOY_PIPELINE_INIT", responseJson });
		} else {
			actionUtils.checkConnectivity(responseJson,dispatch);
		}
    }).catch(error => {
      throw(error);
    });

  };
}

export function list({state,listStart,listLimit,searchCriteria,orderCriteria,info,paginationSegment}) {
	return function(dispatch) {
		let requestParams = {};
		requestParams.action = "LIST_PIPELINE";
		requestParams.service = "PM_DEPLOY_SVC";
		if (listStart != null) {
			requestParams.listStart = listStart;
		} else {
			requestParams.listStart = state.listStart;
		}
		if (listLimit != null) {
			requestParams.listLimit = listLimit;
		} else {
			requestParams.listLimit = state.listLimit;
		}
		if (searchCriteria != null) {
			requestParams.searchCriteria = searchCriteria;
		} else {
			requestParams.searchCriteria = state.searchCriteria;
		}
		if (orderCriteria != null) {
			requestParams.orderCriteria = orderCriteria;
		} else {
			requestParams.orderCriteria = state.orderCriteria;
		}
		if (state.parent != null && state.parentType != null && state.parentType === "DEPLOY") {
			requestParams.deployId = state.parent.id;
		}
		let userPrefChange = {"page":"users","orderCriteria":requestParams.orderCriteria,"listStart":requestParams.listStart,"listLimit":requestParams.listLimit};
		dispatch({type:"PM_DEPLOY_PIPELINE_PREF_CHANGE", userPrefChange});
		let params = {};
		params.requestParams = requestParams;
		params.URI = '/api/member/callService';

		return callService(params).then( (responseJson) => {
			if (responseJson != null && responseJson.protocalError == null){
				dispatch({ type: "PM_DEPLOY_PIPELINE_LIST", responseJson, paginationSegment });
				if (info != null) {
		        	  dispatch({type:'SHOW_STATUS',info:info});  
		        }
			} else {
				actionUtils.checkConnectivity(responseJson,dispatch);
			}
		}).catch(error => {
			throw(error);
		});

	};
}

export function listLimit({state,listLimit}) {
	return function(dispatch) {
		 dispatch({ type:"PM_DEPLOY_PIPELINE_LISTLIMIT",listLimit});
		 dispatch(list({state,listLimit}));
	 };
}

export function search({state,searchCriteria}) {
	return function(dispatch) {
		 dispatch({ type:"PM_DEPLOY_PIPELINE_SEARCH",searchCriteria});
		 dispatch(list({state,searchCriteria,listStart:0}));
	 };
}

export function searchChange({field,value}) {
	return function(dispatch) {
		 let params = {};
		 params.field = field;
		 params.value = value;
		 dispatch({ type:"PM_DEPLOY_PIPELINE_SEARCH_CHANGE",params});
	 };
}

export function saveItem({state}) {
	return function(dispatch) {
		let requestParams = {};
		requestParams.action = "SAVE_PIPELINE";
	    requestParams.service = "PM_DEPLOY_SVC";
	    requestParams.inputFields = state.inputFields;
		if (state.parent != null && state.parentType != null && state.parentType === "DEPLOY") {
			requestParams.deployId = state.parent.id;
		}
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/member/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson != null && responseJson.status != null && responseJson.status == "SUCCESS"){  
	    			dispatch(list({state,info:["Save Successful"]}));
	    		} else if (responseJson != null && responseJson.status != null && responseJson.status == "ACTIONFAILED") {
	    			dispatch({type:'SHOW_STATUS',error:responseJson.errors});
	    		}
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}


export function deleteItem({state,id}) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "DELETE_PIPELINE";
	    requestParams.service = "PM_DEPLOY_SVC";
	    requestParams.itemId = id;
	    
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/member/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson != null && responseJson.status != null && responseJson.status == "SUCCESS"){  
	    			dispatch(list({state,info:["Delete Successful"]}));
	    		} else if (responseJson != null && responseJson.status != null && responseJson.status == "ACTIONFAILED") {
	    			dispatch({type:'SHOW_STATUS',warn:responseJson.errors});
	    		}
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}

export function modifyItem({id,appPrefs,view}) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.service = "PM_DEPLOY_SVC";
		requestParams.action = "ITEM_PIPELINE";
		requestParams.prefFormKeys = new Array("PM_DEPLOY_PIPELINE_FORM");

	    if (id != null) {
	    	requestParams.itemId = id;
	    }
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/member/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		dispatch({ type: 'PM_DEPLOY_PIPELINE_ITEM',responseJson,appPrefs,view});
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}

export function inputChange(field,value) {
	 return function(dispatch) {
		 let params = {};
		 params.field = field;
		 params.value = value;
		 dispatch({ type:"PM_DEPLOY_PIPELINE_INPUT_CHANGE",params});
	 };
}

export function orderBy({state,orderCriteria}) {
	 return function(dispatch) {
		 dispatch({ type:"PM_DEPLOY_PIPELINE_ORDERBY",orderCriteria});
		 dispatch(list({state,orderCriteria}));
	 };
}

export function clearItem() {
	return function(dispatch) {
		dispatch({ type:"PM_DEPLOY_PIPELINE_CLEAR_ITEM"});
	};
}

export function clearField(field) {
	return function(dispatch) {
		let params = {};
		 params.field = field;
		dispatch({ type:"PM_DEPLOY_PIPELINE_CLEAR_FIELD",params});
	};
}
export function setStatus({successes,errors}) {
	 return function(dispatch) {
		 dispatch({ type:"PM_DEPLOY_PIPELINE_SET_STATUS",successes,errors});
	 };
}

export function openDeleteModal({item}) {
	 return function(dispatch) {
		 dispatch({type:"PM_DEPLOY_PIPELINE_OPEN_DELETE_MODAL",item});
	 };
}

export function closeDeleteModal() {
	 return function(dispatch) {
		 dispatch({type:"PM_DEPLOY_PIPELINE_CLOSE_DELETE_MODAL"});
	 };
}

export function cancel({state}) {
	return function(dispatch) {
		dispatch({type:"PM_DEPLOY_PIPELINE_CANCEL"});
		dispatch(list({state}));
	 };
}

export function testSCM({state}) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "TESTSCM";
	    requestParams.service = "PM_DEPLOY_SVC";
	    requestParams.scmServer = state.inputFields.PM_DEPLOY_PIPELINE_FORM_SCM_URL;
	    requestParams.scmUser = state.inputFields.PM_DEPLOY_PIPELINE_FORM_SCM_USER;
	    requestParams.scmPassword = state.inputFields.PM_DEPLOY_PIPELINE_FORM_SCM_PASSWORD;
	    
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/member/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson != null && responseJson.status != null && responseJson.status == "SUCCESS"){
	    			dispatch({ type: 'PM_DEPLOY_PIPELINE_TEST_SCM',responseJson});
	    		} else if (responseJson != null && responseJson.status != null && responseJson.status == "ACTIONFAILED") {
	    			dispatch({type:'SHOW_STATUS',warn:responseJson.errors});
	    		}
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}

export function moveSelect({state,item}) {
	 return function(dispatch) {
		 dispatch({ type:"PM_DEPLOY_PIPELINE_MOVE_SELECT",item});
		 dispatch(list({state}));
	 };
}

export function moveCancel({state}) {
	 return function(dispatch) {
		 dispatch({ type:"PM_DEPLOY_PIPELINE_MOVE_CANCEL"});
		 dispatch(list({state}));
	 };
}

export function moveSave({state,code,item}) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "MOVE_SAVE_PIPELINE";
	    requestParams.service = "PM_DEPLOY_SVC";
	    requestParams.code = code;
	    requestParams.moveSelectedItemId = state.moveSelectedItem.id;
	    requestParams.itemId = item.id
	    
	    if (state.parent != null && state.parentType != null && state.parentType === "DEPLOY") {
			requestParams.deployId = state.parent.id;
		}
	    
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/member/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson != null && responseJson.status != null && responseJson.status == "SUCCESS"){  
	    			dispatch({ type:"PM_DEPLOY_PIPELINE_MOVE_CANCEL"});
	    			dispatch(list({state,info:["Save Successful"]}));
	    		} else if (responseJson != null && responseJson.status != null && responseJson.status == "ACTIONFAILED") {
	    			dispatch({type:'SHOW_STATUS',error:responseJson.errors});
	    		}
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}