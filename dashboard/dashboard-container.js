/*
* Author Edward Seufert
*/
'use-strict';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import fuLogger from '../../core/common/fu-logger';
import DashboardView from '../../memberView/dashboard/dashboard-view';

function DashboardContainer({location,navigate}) {
	const itemState = useSelector((state) => state.memberdashboard);
	

	fuLogger.log({level:'TRACE',loc:'DashboardContainer::render',msg:"Hi there"});
    return (
		<DashboardView
			itemState={itemState}/>
	);
 
}


export default DashboardContainer;
