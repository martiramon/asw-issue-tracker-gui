import Issues from './views/Issues.vue';
import Issue from './views/Issue.vue';
import CreateIssue from './views/CreateIssue.vue';

const routes = [
	{
		path: '/',
		redirect: 'issues',
	},
	{
		path: '/issues',
		name: 'Issues',
		component: Issues
	},
	{
		path: '/issues/new',
		name: 'New Issue',
		component: CreateIssue
	},
	{
		/* Aquest tambe tindra el html del edit issue, amb un bool de mode edicio/vista mostrarem una part o una altre */
		path: '/issues/:id',
		name: 'Issue',
		component: Issue
	}
];

export default routes;
