
# Claude Code

A session is activated in a terminal after `claude` command is called, it has interface on the terminal. Sesion in terminal is more powerful to run commands and see the folder. VS Code's Claude extension is a panel on the right, suitable for interactive messaging and inline fix.

```bash
npm install -g @anthropic-ai/claude-code
claude login
claude logout
claude config list

claude -w my-new-feature    # Create a isolated worktree to develop a feature in parallel
```

<<<<<<< Updated upstream
```
IAM Account
├── Users (people)        → you, your teammates
├── Groups (collections)  → "developers", "admins"
├── Roles (for services)  → Amplify, Lambda, EC2
└── Policies (rules)      → attached to any of the above
```
=======
## Worktree

A worktree is a lighther git clone on another folder to develop in parallel, symlinking shared heavy files. It inherite `.gitignore`. Add `.worktreeinclude` to include ignored files.

## Session command

| Command | Desc | 
| - | - |
| `/clear` | Clear context window |
| `/compact` | Sumamrize context window |
| `/remote-control` | Enable this session to be accessed by web (claude.ai/code/) or app remotely. Remember to keep the terminal alive |
| `/web-setup` | Authenticate with local GitHub credential to run a cloud instance at Anthropic cloud. No local setup required and code at (claude.ai/code/) |

## Config

| File | Scope |
| - | - |
| ~/.claude/settings.jsonGlobal | all projects | 
| /claude/settings.jsonProject | shared with team on workspace |
| .claude/settings.local.jsonProject | personal overrides |

```
{
  "defaultMode": "acceptEdits",
  "permissions": {
    "allow": [
      "Read(//opt/**)",
      "Bash(./venv/bin/python3 run.py)",
      "Bash(npm run *)",
      "Bash(git *)",
      "Bash(mkdir:*)",
      "Bash(ls:*)",
      "Bash(find:*)",
      "Bash(grep:*)",
      "Write(*)",
      "Read(*)",
      "Bash(./venv/bin/python3 run.py /opt/dev/backend/dev/data_v4_c6_4k/all/images)",
      "Bash(tail)"
    ],
    "deny": [
      "Read(.env*)",
      "Bash(rm *)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "INPUT=$(cat); FILE=$(echo \"$INPUT\" | python3 -c \"import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))\" 2>/dev/null); if [[ \"$FILE\" == *.py ]] && [[ \"$FILE\" == /opt/dev/backend/* ]]; then cd /opt/dev/backend && source venv/bin/activate && python -m ruff check \"$FILE\" --fix 2>&1; fi"
          },
          {
            "type": "command",
            "command": "INPUT=$(cat); FILE=$(echo \"$INPUT\" | python3 -c \"import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))\" 2>/dev/null); if [[ \"$FILE\" == /opt/dev/backend/run.py ]]; then cd /opt/dev/backend && source venv/bin/activate && python run.py 2>&1; fi"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "cd /opt/dev/backend && source venv/bin/activate && python -m pytest test/ -v 2>&1"
          }
        ]
      }
    ]
  }
}

```

> Danger Zone: `--dangerously-skip-permissions` is "YOLO mode" CLI flag, bypasses all permission checks, allowing Claude Code to execute all operations without any prompts. `bypassPermissions` is the `defaultMode` value you set inside `settings.json`. It skips permission prompts, though writes to .git, .claude, .vscode, .idea, and .husky directories still prompt for confirmation to prevent accidental corruption. 


## Concepts

- Give a specific example
- Point a good example
- Do one thing at a time
- Flywheel & Guardrail: incrementally tell what not to do 

| Mechanism | Confidence | Samples |
| - | - | - |
| Hooks | 100% | Shell commands |
| Skills | near 100% | Domain knowledge, repeatable flow |
| MCP | 100% | External connect |

## Multiple Agents

A claude session can spawn subagent and managed under the session.

## Token

Pro plan — risky for a full 2-hour agentic session, especially with Opus. You may hit limits and get interrupted. Suitable for frequent light use.
API pay-as-you-go — $3–8 for a 2-hour session is very manageable, and you get no interruptions.
Max 5x ($100/mo) — makes sense if you're doing this kind of work daily; roughly 88,000 tokens per 5-hour window and priority access during peak times

> The average Claude Code API cost is around $6 per developer per day, with 90% of users staying under $12/day. 
>>>>>>> Stashed changes
