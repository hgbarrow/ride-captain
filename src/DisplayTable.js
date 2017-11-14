import React from 'react';
import PropTypes from 'prop-types';
require('./DisplayTable.css');

function DisplayTable(props) {
    
    return (
        <table className="ride-table">
        <thead>
            <tr>
                <th>Ride</th>
                <th>ETA</th>
                <th>Cost</th>
            </tr>
        </thead>
        <tbody>
            {props.rideInfo && props.rideInfo.map(function(ride){
                return (
                    <tr key={ride.display_name}>
                        <td>{ride.display_name}</td>
                        <td>{ride.eta_seconds / 60} min</td>
                        <td>${ride.cost}</td>
                    </tr>
                );
            })}
        </tbody>
        </table>
        
    )
}

DisplayTable.propTypes = {
    rideInfo: PropTypes.array
}

export default DisplayTable;