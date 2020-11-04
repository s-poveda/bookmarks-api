const bookmarksService = {
	getAllBookmarks(db) {
		return db('bookmarks')
			.select();
	},
	getBookmark(db, id) {
		return db('bookmarks')
			.select()
			.where({ id })
			.first();
	},
	updateBookmark(db, id, newInfo) {
		return db('bookmarks')
			.update(newInfo)
			.returning('*')
			.first();
	},
	createBookmark(db, bookmark) {
		return db('bookmarks')
			.insert(bookmark)
			.returning('*')
			.first();
	},
	deleteBookmark(db, id) {
		return db('bookmarks')
			.where({ id })
			.del();
	}
}

module.exports = bookmarksService;
