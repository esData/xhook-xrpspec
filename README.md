# XRPspec - Behavior driven workflow test framework for XRPL

## Table of Contents

1. [Description](#description)
1. [Beginning with XRPspec](#Beginning with XRPspec)
1. [Limitations - OS compatibility, etc.](#limitations)

## Description

This repository contain Test spec implementation for Ripple - XRPspec, uses the XhookControl framework. The tools develop on top of xHookControl framework with the objective to make the test scenario and test cases predictable, simpler and more efficient in any test phases.

The tools generate testing insight and outcome reports after integrated in Git action or any CI tools each time a Git changes committed.

A XRPspec CLI allow developer to prepare `well defined` test spec that will collect, inspect API result and evaluate XRP account, ledger transaction, data types and metadata to ensure build was in expected results.

### Directory structure

```text
.
├── metadata.yaml             # metadata describing this integration
├── LICENSE                   # defaults to Apache, replace if that doesn't suit
├── README.md                 # this the files
├── _helpers                  # helpers lib
│  └── steps_helper.js           # Step helpers library
├── steps                     # subdirectory for execution steps
│  └── xrpspec                # XRPspec folder
|     ├── README.md              # detail about how to use this step
│     ├── ripple-xrpspec.js        # entrypoint script for XRPspec implementation
      ├── icon.png/svg             # picture of workflow graph from app
│     └── step.yaml              # step metadata 
├── accounts                  # inline accounts
│  └── sg_backlists.csv         # accounts uses in workflows or templating
└── workflows                 # subdirectory for example workflows
   └── <WorkflowName>              # an example workflow
      ├── README.md                # how to use this workflow
      ├── icon.png/svg             # picture of workflow graph from app
      └── WorkflowName.yaml        # the workflow itself
```

## Beginning with XRPspec

XRP test spec uses the JEST(Javascript testing) library and associate the necessary XRPL API, object and metadata to make the test simplier to define. A quick way to define the XRPspec, using spec.yaml file.

Test spec defination.

```text
  [test_case_name]:
    step: ripple-xrpspec   <-- indicate XRPspec params
    parameters:
      assertion: [assertion]    <--- assertion
      object: [inspected_object]   <--- inspected_object
      value: [expected_value]  <---  expected_value
```

A example of Payment transactions test spec.

```yaml
---
  ## Load Source account object <-- this will not be necessary after XRPspec refer to objects and will automatically loaded.
  account_info_01_post:
    dependsOn: pay01
    step: ripple-account_info
    delay: 5
  ## Load Target account object
  account_info_02_post:
    dependsOn: account_info_01_post
    step: ripple-account_info
    delay: 5
    parameters:
      account: rGjtrRRicdDhv8DGXNmr1TJhiDxSe6392K
  cal_source_balance:
    step: ripple-accept
    dependsOn: account_info_01_post
    parameters:
      amount: ?[$[steps.account_info_01.outputs.Balance] - $[steps.pay01.parameters.amount]]
  ## XRPspec
  inspect_source_account:
    step: ripple-xrpspec
    dependsOn: cal_source_balance
    parameters:
      assertion: toEqual
      object: $[steps.account_info_01_post.outputs.Balance] # <--- will autoload object
      value: ?[$[steps.cal_source_balance.parameters.amount] - $[steps.pay01.outputs.result.tx_json.Fee]]
  inspect_target_account:
    step: ripple-xrpspec
    dependsOn: inspect_source_account
    parameters:
      assertion: toEqual
      object: $[steps.account_info_02_post.outputs.Balance] # <--- will autoload object
      value: ?[$[steps.account_info_02.outputs.Balance] + $[steps.pay01.parameters.amount]]
```

### License

As indicated by the repository, this project is licensed under Apache 2.0.
