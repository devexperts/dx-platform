import { findImports, ImportKind } from 'tsutils';
import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
	/* tslint:disable:object-literal-sort-keys */
	public static metadata: Lint.IRuleMetadata = {
		ruleName: 'disallow-imports',
		description: Lint.Utils.dedent`Disallows importing by pattern.`,
		rationale: Lint.Utils.dedent`
            Useful for lerna-driven projects to avoid mistakes imports from compiled or source code`,
		optionsDescription: 'A list of mistakes patterns',
		options: {
			type: 'array',
			items: {
				type: 'string',
			},
		},
		optionExamples: [true, [true, 'rxjs/observable', '@angular/platform-browser', '@angular/core/testing']],
		type: 'functionality',
		typescriptOnly: false,
	};

	public static FAILURE_STRING = 'import from this paths disallowed';

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
		return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
	}
}

function walk(ctx: Lint.WalkContext<string[]>) {
	for (const name of findImports(ctx.sourceFile, ImportKind.All)) {
		if (isBlackListed(name.text, ctx.options)) {
			ctx.addFailureAtNode(name, Rule.FAILURE_STRING);
		}
	}
}

function isBlackListed(path: string, blacklist: string[]): boolean {
	for (const option of blacklist) {
		if (path === option || path.includes(`${option}/`)) {
			return true;
		}
	}
	return false;
}
