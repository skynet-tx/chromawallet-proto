/** @jsx React.DOM */

var React = require('react');

var tradeMixins = {
	getSumForBuyBlock: function () {
		var quantity = this.getNumbersValue(this.state.quantity),
			price = this.getNumbersValue(this.state.price);

		this.setState({quantity: quantity});
		this.setState({price: price});

		if (quantity && price) {
			this.setTotalValue(parseFloat(quantity * price).toFixed(2));
		} else {
			this.setTotalValue(0);
		}

	},

	getNumbersValue: function (val) {
		var pattern = /[^0-9.]+/g;
		return val.replace(pattern, "");
	},

	setTotalValue: function (value) {
		this.setState({total: value});
	},

	handleOnQuantityChange: function (newValue) {
		this.setState({quantity: newValue}, this.getSumForBuyBlock);
	},

	handleOnPriceChange: function (newValue) {
		this.setState({price: newValue}, this.getSumForBuyBlock);
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

	render: function () {
		var isDisabled = (this.props.tradeData.currency && this.props.tradeData.currency != "#") ? false : true;
		var quantity = {
				value: this.state.quantity,
				requestChange: this.handleOnQuantityChange
			},
			price = {
				value: this.state.price,
				requestChange: this.handleOnPriceChange
			};
		return (
			<fieldset>
				<legend>Buy</legend>
				<ul>
					<li className="field">
						<input className="narrow text input"
							valueLink={quantity}
							disabled={isDisabled} id="text1"
							type="text" placeholder="Quantity" />
						<span>&nbsp;X&nbsp;</span>
						<input className="narrow text input"
							disabled={isDisabled}
							valueLink={price}
							id="text2" type="text" placeholder="Price" />
					</li>
					<li className="row">
						<div className="eight columns">
							<div>Total: {this.state.total}</div>
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
	mixins: [tradeMixins],

	getInitialState: function () {
		return {
			quantity: "",
			price: "",
			total: 0
		};
	},

	render: function () {
		var isDisabled = (this.props.tradeData.currency && this.props.tradeData.currency != "#") ? false : true;
		var quantity = {
				value: this.state.quantity,
				requestChange: this.handleOnQuantityChange
			},
			price = {
				value: this.state.price,
				requestChange: this.handleOnPriceChange
			};

		return (
			<fieldset>
				<legend>Sell</legend>
				<ul>
					<li className="field">
						<input className="narrow text input"
							valueLink={quantity}
							disabled={isDisabled} id="text1"
							type="text" placeholder="Quantity" />
						<span>&nbsp;X&nbsp;</span>
						<input className="narrow text input"
							valueLink={price}
							disabled={isDisabled}
							id="text2" type="text" placeholder="Price" />
					</li>
					<li className="row">
						<div className="eight columns">
							<div>Total: {this.state.total}</div>
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
