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
	},
	//return true on succes. false on fail
	removeBookmark (id) {
		const startLen = this.bookmarks.length;
		this.bookmarks = this.bookmarks.filter( mark=> mark.id !== id );
		if (startLen === this.bookmarks.length) return false;
		return true;
	}

}

module.exports = store;
