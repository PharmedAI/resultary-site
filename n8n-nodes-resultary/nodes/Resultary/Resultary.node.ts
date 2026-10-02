import {
	NodeConnectionTypes,
	type IDataObject,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

const credentialType = 'resultaryOAuth2Api';
const apiBase = 'https://api.getresultary.com';

export class Resultary implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Resultary',
		name: 'resultary',
		icon: 'file:../../icons/resultary.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Verify automation outcomes with Resultary',
		defaults: {
			name: 'Resultary',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: credentialType,
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Send Run Signal',
						value: 'signal',
						description: 'Tell Resultary this n8n execution ran',
						action: 'Send a run signal',
					},
					{
						name: 'Verify Connection',
						value: 'verify',
						description: 'Check the Resultary connection without creating a run',
						action: 'Verify the connection',
					},
					{
						name: 'Get Run Status',
						value: 'status',
						description: 'Read the current Resultary status for a run',
						action: 'Get run status',
					},
				],
				default: 'signal',
			},
			{
				displayName: 'Run ID',
				name: 'runId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['status'],
					},
				},
				description: 'Resultary run ID to inspect',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const operation = this.getNodeParameter('operation', 0) as string;
		const output: INodeExecutionData[] = [];

		for (let i = 0; i < Math.max(items.length, 1); i++) {
			let response: IDataObject;

			if (operation === 'verify') {
				response = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					credentialType,
					{
						method: 'GET',
						url: `${apiBase}/v1/integration`,
						json: true,
					},
				)) as IDataObject;
			} else if (operation === 'status') {
				const runId = this.getNodeParameter('runId', i) as string;
				response = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					credentialType,
					{
						method: 'GET',
						url: `${apiBase}/v1/runs/${encodeURIComponent(runId)}`,
						json: true,
					},
				)) as IDataObject;
			} else {
				const workflow = this.getWorkflow();
				const executionId = this.getExecutionId();
				const workflowId =
					typeof workflow.id === 'string' && workflow.id.length > 0 ? workflow.id : workflow.name;

				response = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					credentialType,
					{
						method: 'POST',
						url: `${apiBase}/v1/runs`,
						body: {
							executionId,
							workflowId,
						},
						json: true,
					},
				)) as IDataObject;
			}

			output.push({
				json: response,
				pairedItem: items.length > 0 ? { item: i } : undefined,
			});
		}

		return [output];
	}
}
