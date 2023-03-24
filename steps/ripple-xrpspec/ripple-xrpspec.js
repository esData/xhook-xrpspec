const shelper = require("../../_helpers/steps_helper");
const stepsHelper = new shelper(__dirname);
const expect = require("expect");

/* ripple-xrpspec
 * **SUMMARY:** Step to assert results
 *
 * **PARAMETERS:**
 * @param
 * **OUTPUT:**
 * @param
 */

module.exports = function (workflowId, stepName, step, log, callback) {
  // Validate parameters based on metadata
  var missing_params = stepsHelper.validate_params(step.parameters);
  if (missing_params.length > 0) {
    stepsHelper.setError(
      step,
      `${workflowId}@${stepName}: missing parameters ${missing_params}.`
    );
    callback(step);
  } else {
    try {
      var assertion = step.parameters.assertion;

      log.debug("Assertions: " + step.parameters.assertion);
      log.debug("Object: " + JSON.stringify(step.parameters.object));
      log.debug("Expect value: " + JSON.stringify(step.parameters.value));

      if (assertion === "toExist" || assertion === "toNotExist") {
        expect.expect(step.parameters.object)[assertion](step.parameters.value);
      } else if (
        assertion === "toBe" ||
        assertion === "toNotBe" ||
        assertion === "toEqual" ||
        assertion === "toNotEqual" ||
        assertion === "toBeA" ||
        assertion === "toNotBeA" ||
        assertion === "toMatch" ||
        assertion === "toBeLessThan" ||
        assertion === "toBeGreaterThan" ||
        assertion === "toInclude" ||
        assertion === "toExclude"
      ) {
        expect.expect(step.parameters.object)[assertion](step.parameters.value);
        log.info(
          `❏ xrpSpec: ${stepName}: \x1b[30m\x1b[42mGOOD\x1b[0m`
        );
        stepsHelper.setOutputs(step, true);
      } else {
        stepsHelper.setError(
          step,
          `${workflowId}@${stepName}: Unknown or unsupported expect function [${assertion}]`
        );
      }
      stepsHelper.setOutputs(step, true);
    } catch (expectError) {
      step.ignore = true;
      stepsHelper.setError(step, expectError.message);
      stepsHelper.setOutputs(step, false);
      log.info(
        `❏ xrpSpec: ${stepName}: \x1b[30m\x1b[41mBAD\x1b[0m`
      );
    }
  }
  callback(step);
};
