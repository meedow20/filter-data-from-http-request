import React from 'react';
import './App.css';
import {LoadingOutlined} from "@ant-design/icons";
import axios from "axios";
import {AppState, DataType} from "../../../types/types";

export class App extends React.Component<any, AppState> {

    state: AppState = {
        data: [],
        resetFilters: [],
        initialized: false,
        inputValue: '',
        isCheckBoxChecked: false
    }

    private getDataFromHttpRequest() {
        axios.get('https://cors.bridged.cc/https://www.mrsoft.by/data.json')
            .then(response => {
                const data = response.data;
                for (let item in data) {
                    if (data.hasOwnProperty(item)) {
                        const dataItems: DataType = data[item];
                        this.setState({data: dataItems, initialized: true, resetFilters: dataItems});
                    }
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    private filterDataByLength = () => {
        const {inputValue} = this.state;
        if (!+inputValue) {
            return;
        }

        const {data} = this.state;
        const filteredData: DataType = data.filter((dataItem: string) => dataItem.length > +inputValue);
        this.setState({data: filteredData});
    }

    private filterDataBySubstring = () => {
        const {inputValue} = this.state;
        if (+inputValue) {
            return;
        }

        const {data} = this.state;
        const {isCheckBoxChecked} = this.state;
        const filteredData: DataType = isCheckBoxChecked ?
            data.filter((dataItem: string) => dataItem.includes(inputValue)) :
            data.filter((dataItem: string) => dataItem.toLowerCase().includes(inputValue.toLowerCase()));
        this.setState({data: filteredData});
    }

    private resetFilters = () => {
        this.setState({data: this.state.resetFilters})
    }

    private updateInputValue(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            inputValue: e.target.value
        });
    }

    private updateCheckBoxChecked = () => {
        const {isCheckBoxChecked} = this.state;
        this.setState({
            isCheckBoxChecked: !isCheckBoxChecked
        });
    }

    componentDidMount() {
        this.getDataFromHttpRequest();
    }

    render(): React.ReactNode {
        if (!this.state.initialized) {
            return (
                <div className='loaderContainer'>
                    <LoadingOutlined className='loader'/>
                </div>
            )
        }

        const {data} = this.state;
        return (
            <>
                <div className="filtersContainer">
                    <div>
                        <input placeholder="Enter a value to search"
                               className="inputSearch"
                               value={this.state.inputValue}
                               onChange={e => this.updateInputValue(e)}/>
                        <label>
                            Register: <input type="checkbox" onClick={this.updateCheckBoxChecked}/>
                        </label>
                    </div>
                    <div className="filtersButtonsContainer">
                        <button className="filterButton" onClick={this.filterDataByLength}>Filter by length</button>
                        <button className="filterButton" onClick={this.filterDataBySubstring}>Substring filter</button>
                        <button className="filterButton" onClick={this.resetFilters}>Reset filters</button>
                    </div>
                </div>
                <div className="dataContainer">
                    <ul>
                        {data.map((dataItem: string) => <li key={dataItem}>{dataItem}</li>)}
                    </ul>
                </div>
            </>
        )
    }
}
