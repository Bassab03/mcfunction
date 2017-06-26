'use babel';

import McfunctionView from './mcfunction-view';
import { CompositeDisposable } from 'atom';

export default {

	mcfunctionView: null,
	modalPanel: null,
	subscriptions: null,

	activate(state) {
		this.mcfunctionView = new McfunctionView(state.mcfunctionViewState);
		this.modalPanel = atom.workspace.addModalPanel({
			item: this.mcfunctionView.getElement(),
			visible: false
		});

		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable();

		// Register command that toggles this view
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'mcfunction:toggle': () => this.toggle()
		}));
	},

	deactivate() {
		this.modalPanel.destroy();
		this.subscriptions.dispose();
		this.mcfunctionView.destroy();
	},

	serialize() {
		return {
			mcfunctionViewState: this.mcfunctionView.serialize()
		};
	},

	toggle() {
		console.log('Mcfunction was toggled!');
		return (
			this.modalPanel.isVisible() ?
			this.modalPanel.hide() :
			this.modalPanel.show()
		);
	}

};
