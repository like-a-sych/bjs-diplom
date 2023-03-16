'use strict';

// Выход из личного кабинета
const logoutButton = new LogoutButton();

logoutButton.action = () => ApiConnector.logout(response => {
	if (response.success) {
		location.reload();
	} else {
		alert(response.error)
	}
});
// Получение информации о пользователе
ApiConnector.current(response =>
	ProfileWidget.showProfile(response.data));


// Получение текущих курсов валюты
const board = new RatesBoard();

function getStocks() {
	ApiConnector.getStocks(response => {
		if (response.success) {
			board.clearTable();
			board.fillTable(response.data);
		}
	})
};
getStocks();
setInterval((getStocks), 60000);


// Операции с деньгами
const money = new MoneyManager();

//  Пополнение баланса

money.addMoneyCallback = (data) => ApiConnector.addMoney(data, response => {
	if (response.success) {
		money.setMessage(true, `Баланс пополнен на ${data.amount} ${data.currency}`);
		ProfileWidget.showProfile(response.data);
	} else {
		money.setMessage(false, `Невозможно пополнить баланс`);
	}
})
// Конвертация валюты

money.conversionMoneyCallback = (data) => {
	ApiConnector.convertMoney(data, response => {
		if (response.success) {
			money.setMessage(true, `Вы успешно конвертировали ${data.fromAmount} ${data.fromCurrency} в  ${data.targetCurrency}`);
			ProfileWidget.showProfile(response.data);
		} else {
			money.setMessage(false, `Невозможно конвертировать валюту`);
		}
	})
}

// Перевод валюты
money.sendMoneyCallback = data => {


	ApiConnector.transferMoney(data, response => {
		if (response.success) {
			console.log(data)
			money.setMessage(true, `Вы успешно перевели ${data.to} ${data.amount} ${data.currency}`);
			ProfileWidget.showProfile(response.data);
		} else {
			money.setMessage(false, `Невозможно перевести валюту`);
		}
	})
}

// Работа с избранным
const favorites = new FavoritesWidget();

ApiConnector.getFavorites(response => {
	if (response.success) {
		favorites.clearTable();
		favorites.fillTable(response.data);
		money.updateUsersList(response.data);
	}
})

// Добавление пользователя

favorites.addUserCallback = data => {

	ApiConnector.addUserToFavorites(data, response => {
		if (response.success) {
			favorites.setMessage(true, `Пользователь ${data.name} c id = ${data.id} добавлен в список избранных`);
			favorites.clearTable();
			favorites.fillTable(response.data);
			money.updateUsersList(response.data);
		} else {
			favorites.setMessage(false, `Невозможно добавить пользователя`);
		}
	})
}

// Удаление пользователя
favorites.removeUserCallback = id => {
	ApiConnector.removeUserFromFavorites(id, response => {
		if (response.success) {
			favorites.setMessage(true, `Пользователь c id = ${id} удален из списка избранных`);
			favorites.clearTable();
			favorites.fillTable(response.data);
			money.updateUsersList(response.data);
		} else {
			favorites.setMessage(false, `Невозможно удалить пользователя`);
		}
	});
}