import React, { Component } from "react";
import Css from "./App.module.css";

import BounceLoader from "react-spinners/BounceLoader";

class App extends Component {
  state = {
    inputValue: "",
    prevStateinputValue: "",
    imei: null,
    isIncomeFetch: false,
    isLoading: false
  };

  onChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  fetchData = () => {
    const { inputValue } = this.state;
    this.setState({ isLoading: true });
    fetch(`https://imeiapi.herokuapp.com/imei/${inputValue}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ imei: data.findImei });
      })
      .finally(() => {
        this.setState({ isIncomeFetch: true });

        this.setState({ isLoading: false });
      });
  };

  onSubmit = e => {
    const { inputValue } = this.state;
    e.preventDefault();
    if (!inputValue && inputValue === "") {
      return;
    }
    this.fetchData();

    this.setState(state => ({
      prevStateinputValue: state.inputValue
    }));
    this.setState({ inputValue: "" });
  };
  sliceData = () => {
    const { imei } = this.state;
    return imei.INSERT_DATE.slice(0, 10);
  };

  render() {
    const {
      inputValue,
      imei,
      isLoading,
      isIncomeFetch,
      prevStateinputValue
    } = this.state;

    return (
      <>
        <div className={Css.container}>
          {isLoading && (
            <div className={Css.spinerContainer}>
              <BounceLoader
                className={Css.override}
                size={80}
                // size={"150px"} this also works
                color={"#FEAF12"}
                loading={this.state.loading}
              />
            </div>
          )}
          <form onSubmit={this.onSubmit} className={Css.search_form}>
            <input
              className={Css.search_form_input}
              type="number"
              value={inputValue}
              onChange={this.onChange}
              placeholder=" Введіть IMEI"
            />
            <button className={Css.btn} type="submit">
              Пошук
            </button>
          </form>

          {!isIncomeFetch ? (
            <p>
              Для пошуку IMEI введіть на телефоні
              <span className={Css.bold}> *#06#</span>
            </p>
          ) : (
            <div>
              {imei ? (
                <div>
                  <h2 className={Css.responceText}>В РОЗШУКУ!</h2>
                  <p>Телефон: {imei.NZ}</p>
                  <p>IMEI: {imei.IMEI}</p>
                  {imei.OVD && <p>Відділення поліції: {imei.OVD}</p>}
                  <p>
                    Внесено до бази: {imei.INSERT_DATE && this.sliceData()}{" "}
                  </p>
                </div>
              ) : (
                <div>
                  <p>
                    <span className={Css.bold}> {prevStateinputValue}</span>{" "}
                    немає в базі розшуку
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }
}
export default App;
