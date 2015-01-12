/** @jsx React.DOM */

var React = require('react');

var tradeMixins = {
	getSumForBuyBlock: function(){
		console.log(">>", this.state);
		var quantity = this.state.quantity,
			price = this.state.price;

		//if(!this.checkForIntValue(quantity)){
		//	this.setState({quantity: ''});
		//}
		//
		//if(!this.checkForIntValue(price)){
		//	this.setState({price: ''});
		//}
		//
		//console.log("quantity >>", quantity);
		//console.log("price >>", price);

	},

	checkForIntValue: function (val) {
		var reg = new RegExp('^\\d+$');
		return reg.test(val);
	}

};

var SelectBox = React.createClass({
	handleChange: function (eve) {
		var optionValue = eve.target.value;
		this.setState({option: optionValue});
		this.props.onOptionChange({currency: optionValue});
	},

	getInitialState: function () {
		return {option: '#'};
	},

	render: function () {
		var options = this.props.options,
			value = this.state.option;

		return (
			<div className="row">
				<div className="twelve columns">
					<div className="field">
						<div className="picker">
							<select value={value}
								onChange={this.handleChange}
								id="receive-filter">
								<option value="#">Show only</option>
							{
								options.map(function (option) {
									if (option.getMoniker() === "bitcoin") return;

									return (
										<SelectBoxOption key={option.getAddress()} option={option} />
									);
								})
								}
							</select>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var SelectBoxOption = React.createClass({
	render: function () {
		var option = this.props.option,
			available = option.getAvailableBalance(),
			text = option.getMoniker() + " (" + available + " available)";
		return (
			<option value={option.getMoniker()}>{text}</option>
		);
	}
});

var BuyBlock = React.createClass({
	mixins: [tradeMixins],

	getInitialState: function () {
		return {
			quantity: "",
			price: "",
			total: 0
		};
	},

	handleOnQuantityChange: function (eve) {
		var quantity = eve.target.value;
		this.setState({quantity: quantity}, this.getSumForBuyBlock);
	},

	handleOnPriceChange: function (eve) {
		var price = eve.target.value;
		this.setState({price: price}, this.getSumForBuyBlock);
	},

	render: function () {
		var isDisabled = (this.props.tradeData.currency && this.props.tradeData.currency != "#") ? false : true;
		return (
			<fieldset>
				<legend>Buy</legend>
				<ul>
					<li className="field">
						<input className="narrow text input"
							value={this.state.quantity}
							onKeyUp={this.handleOnQuantityChange}
							disabled={isDisabled} id="text1"
							type="text" placeholder="Quantity" />
						<span>&nbsp;X&nbsp;</span>
						<input className="narrow text input"
							onKeyPress={this.handleOnPriceChange}
							disabled={isDisabled}
							value={this.state.price}
							id="text2" type="text" placeholder="Price" />
					</li>
					<li className="row">
						<div className="eight columns">
							<div>Total: 123.40</div>
							<div>Available:
								<span>14 BTC</span>
							</div>
						</div>
						<div className="four columns">
							<div className="medium primary btn">
								<a disabled={isDisabled} href="#">Buy</a>
							</div>
						</div>
					</li>
				</ul>
			</fieldset>
		);
	}
});

var BuyTable = React.createClass({
	render: function () {
		return (
			<table>
				<thead>
					<tr>
						<th>Price</th>
						<th>Quantity</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>3.4</td>
						<td>10</td>
						<td>34</td>
					</tr>
				</tbody>
			</table>
		);
	}
});

var SellBlock = React.createClass({
	render: function () {
		var isDisabled = (this.props.tradeData.currency && this.props.tradeData.currency != "#") ? false : true;
		return (
			<fieldset>
				<legend>Sell</legend>
				<ul>
					<li className="field">
						<input className="narrow text input" disabled={isDisabled} id="text1" type="text" placeholder="Quantity" />
						<span>&nbsp;X&nbsp;</span>
						<input className="narrow text input" disabled={isDisabled} id="text2" type="text" placeholder="Price" />
					</li>
					<li className="row">
						<div className="eight columns">
							<div>Total: 123.40</div>
							<div>Available:
								<span>14 BTC</span>
							</div>
						</div>
						<div className="four columns">
							<div className="medium primary btn">
								<a disabled={isDisabled} href="#">Sell</a>
							</div>
						</div>
					</li>
				</ul>
			</fieldset>
		);
	}
});

var SellTable = React.createClass({
	render: function () {
		return (
			<table>
				<thead>
					<tr>
						<th>Price</th>
						<th>Quantity</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>-</td>
						<td>-</td>
						<td>-</td>
					</tr>
				</tbody>
			</table>
		);
	}
});

var EventLogBlock = React.createClass({
	render: function () {
		return (
			<ul>
				<li>Create ask 10 gold-coin @4.3 BTC</li>
				<li>Create ask 8 gold-coin @2.3 BTC</li>
			</ul>
		);
	}
});


var Trade = React.createClass({

	getInitialState: function () {
		return {tradeData: {}};
	},

	handleItemChange: function (optionCurrency) {
		this.setState({tradeData: optionCurrency});
	},

	render: function () {
		var options = this.props.wallet.getAssetModels();

		return (
			<div className="trade">
				<div className="row">
					<h2>P2P Trade</h2>
				</div>
				<SelectBox onOptionChange={this.handleItemChange} options={options} />

				<div className="row">

					<div className="four columns">
						<BuyBlock tradeData={this.state.tradeData} />
						<BuyTable tradeData={this.state.tradeData} />
					</div>

					<div className="four columns">
						<SellBlock tradeData={this.state.tradeData} />
						<SellTable tradeData={this.state.tradeData} />
					</div>

					<div className="four columns">
						<h3>Event log</h3>
						<EventLogBlock/>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Trade;
