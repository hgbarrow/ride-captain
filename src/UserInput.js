import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import PropTypes from 'prop-types';
require('./UserInput.css')
var React = require('react');


class UserInput extends React.Component {
    constructor(props){
        super(props)

        this.state = {start: "",
                     end: ""}

        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleGetLocation = this.handleGetLocation.bind(this);
        this.onChange = (address) => this.setState({ address });
    }
    handleChangeStart(startAddress) {
        this.setState({start: startAddress});
    }
    handleChangeEnd(endAddress) {
        this.setState({end: endAddress});
    }
    handleSubmit(event) {
        event.preventDefault();

        geocodeByAddress(this.state.start)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                var start = latLng;
                start.address = this.state.start;
                geocodeByAddress(this.state.end)
                    .then(results => getLatLng(results[0]))
                    .then(latLngEnd => {
                        var end = latLngEnd;
                        end.address = this.state.end;
                        this.props.onSubmit(start, end);
                    }).catch(error => console.error('Error', error))
            })
            .catch(error => console.error('Error', error))
        
    }

    handleGetLocation(){
        var geocoder = new window.google.maps.Geocoder();
        if (true) {
            navigator.geolocation.getCurrentPosition((position)=>{
                position.latlng = {lat: parseFloat(position.coords.latitude), 
                                   lng: parseFloat(position.coords.longitude)};
                geocoder.geocode({'location': position.latlng}, (results, status)=>{
                    if(status === 'OK'){
                        if(results[0]) {
                            this.setState({
                                start: results[0].formatted_address
                            })
                        }
                    }
                })
            });
        }
    }
    render() {
        const inputPropsStart = {
            value: this.state.start,
            onChange: this.handleChangeStart,
        }
        const inputPropsEnd = {
            value: this.state.end,
            onChange: this.handleChangeEnd,
        }
        const inputStyles = {
            input: {width: '90%', textAlign: 'center'},
            autocompleteContainer: {
                fontWeight: 'normal'
            }
        }

        const buttonValid = (this.state.start.length > 0 && this.state.end.length > 0);
        return(
            <div className="user-input">
                <button onClick={this.handleGetLocation}>Get Location</button>
                <form onSubmit={this.handleSubmit}>
                <div className="dual-forms">
                    <div className="input-group">
                        Start Address:
                        <PlacesAutocomplete inputProps={inputPropsStart} styles={inputStyles}/>
                    </div>
                    <div className="input-group">
                        End Address:
                        <PlacesAutocomplete inputProps={inputPropsEnd} styles={inputStyles}/>
                    </div>
                </div>  
                    {buttonValid && 
                        <button id="submit-button" disabled={!buttonValid}>Submit</button>
                    }
                </form>
            </div>
        )
    }
}

UserInput.propTypes = {
    onSubmit: PropTypes.func.isRequired
}
export default UserInput;