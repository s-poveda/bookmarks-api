const {v4: uuid} = require('uuid');

const store =	{
		bookmarks : [
		{
			title: 'sample title',
			rating: 2,
			desc: 'description',
			url: 'http://sample.com',
			id: 'sampleID'
		}
	],

	//adds object to the store and return the added object
	addBookmark (obj) {
		obj.id = uuid();
		this.bookmarks = [...this.bookmarks, obj];
		return obj;
	}
}

module.exports = store;
