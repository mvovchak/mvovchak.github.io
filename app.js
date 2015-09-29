angular.module('noteapp', [])

.directive('notepad', function (notesFactory, $timeout) {
	return {
		restrict: 'AE',
		scope: {},
		link: function (scope, elem, attrs) {
			scope.currentNote = [{}, {}, {}];

			scope.restore = function () {
				scope.notes = notesFactory.getAll();
				scope.index = -1;
				scope.editMode = false;
			};

			scope.openEditor = function (index) {
				scope.editMode = true;
				if (index !== undefined) {
					scope.currentNote = notesFactory.get(index).data;
					scope.index = index;
				} else {
					scope.currentNote.forEach(function (item) {
						item.conent = "";
					});
					scope.currentNote = [{}, {}, {}];
				}
			};

			scope.saveNote = function () {
				var noteElements = elem.find("textarea"),
					notes = {
						id: -1,
						data: []
					};

				Array.prototype.forEach.call(noteElements, function (noteElem) {
					var noteText = noteElem.value,
						note = {
							title: noteText.length > 20 ? noteText.substring(0, 20) : noteText,
							content: noteText
						};
					notes.data.push(note);
				});

				notes.id = scope.index !== -1 ? scope.index : localStorage.length;
				scope.notes = notesFactory.put(notes);
				scope.restore();
			};

			scope.deleteNote = function () {
				console.log("Index is: " + scope.index);
				if (scope.index !== -1) {
					scope.notes = notesFactory.delete(scope.index);
				}
				scope.restore();
			};

			scope.restore();
		},
		templateUrl: 'template.html'
	};
})

.factory('notesFactory', function () {
	return {
		put: function (note) {
			localStorage.setItem('note' + note.id, JSON.stringify(note));
			return this.getAll();
		},
		get: function (index) {
			return JSON.parse(localStorage.getItem('note' + index));
		},
		getAll: function () {
			var notes = [];
			for (var key in localStorage) {
				notes.push(JSON.parse(localStorage.getItem(key)));
			}
			return notes;
		},
		delete: function (index) {
			localStorage.removeItem('note' + index);
			return this.getAll();
		}
	};
});