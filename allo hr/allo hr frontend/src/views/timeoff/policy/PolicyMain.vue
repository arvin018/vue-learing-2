<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="primary" @click="addPolicyModalOpen">Add New Policy</el-button>
      </div>
      <el-table
        :data="policiesSummary"
      >
        <el-table-column label="Policy Code">
          <template slot-scope="scope">{{ scope.row.policy_code }}</template>
        </el-table-column>
        <el-table-column label="Policy Name">
          <template slot-scope="scope">{{ scope.row.policy_name }}</template>
        </el-table-column>
        <el-table-column label="Effective Date">
          <template slot-scope="scope">{{ scope.row.effective_date }}</template>
        </el-table-column>
        <el-table-column label="Expired at">
          <template v-if="scope.row.is_policy_will_expire" slot-scope="scope">
            {{
              scope.row.is_expired_at_daymonth
                ? scope.row.expired_policy_at_x_day + '-' + scope.row.expired_policy_at_x_month
                : (
                  scope.row.is_expired_at_month_duration
                    ? 'Expired after ' + scope.row.expired_policy_duration_month + ' month(s)'
                    : (scope.row.is_expired_at_work_anniversary ? 'Employee\'s working anniversary' : '-')
                )
            }}
          </template>
        <!-- <template slot-scope="scope" v-if="!scope.row.is_policy_will_expire">
          -
        </template> -->
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary">
                Actions<i class="el-icon-arrow-down" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <p @click="openModalDetails(scope.row.policy_code)">See Details</p>
                </el-dropdown-item>
                <el-dropdown-item>
                  <p @click="openModalAssignEmp(scope.row.policy_code)">Assign Employee</p>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type="danger" @click="deletePolicy(scope.row.policy_code)">Delete Policy</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- ============= modal detail ============== -->
    <el-dialog width="80%" style="height: 100%;" title="Policy Details" :visible.sync="policyDetailsVisible">
      <el-tabs type="border-card" @tab-click="handleClick">
        <el-tab-pane style="height: 400px; overflow-y: auto;" label="Details">
          <!-- policy details -->
          <el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <div>
                  <el-col :span="8"><b><p>Policy Code: </p></b></el-col>
                  <el-col :span="15">
                    <el-input
                      disabled
                      :value="policyDetail != null ? policyDetail.policy_code : '-'"
                    />
                  </el-col>
                </div>
              </el-col>
              <el-col :span="12">
                <div>
                  <el-col :span="8"><b><p>Policy Name *:</p></b></el-col>
                  <el-col :span="15">
                    <el-input
                      disabled
                      :value="policyDetail != null ? policyDetail.policy_name : '-'"
                    />
                  </el-col>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <div>
                  <el-col :span="8"><b><p>Effective Date *:</p></b></el-col>
                  <el-col :span="15">
                    <el-date-picker disabled style="width: 100%" :value="policyDetail != null ? new Date(policyDetail.effectiveDate) : new Date()" />
                  </el-col>
                </div>
              </el-col>
              <el-col :span="12">
                <div>
                  <el-col :span="8"><b><p>Expired At:</p></b></el-col>
                  <el-col :span="15">
                    <el-input
                      disabled
                      :value="policyDetail != null ? expiredAtTableColumnValue(policyDetail.policy_code) : '-'"
                    />
                  </el-col>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <div>
                  <el-col :span="5"><b><p>Policy Description:</p></b></el-col>
                  <el-col :span="19">
                    <el-input
                      disabled
                      :value="policyDetail != null ? policyDetail.policy_description : '-'"
                    />
                  </el-col>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div>
                  <el-col :span="15"><b><p>Unlimited Balance Timeoff:</p></b></el-col>
                  <el-checkbox
                    style="float: none"
                    :value="policyDetail != null ? policyDetail.is_unlimited_balance : true"
                  />
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <div>
                  <el-col :span="8"><b><p>Policy Type:</p></b></el-col>
                  <el-col :span="15">
                    <el-select v-model="selectedPolicyType" disabled :value-key="policyDetail != null ? policyDetail.policy_type : null">
                      <el-option
                        v-for="option in policyTypeOptions"
                        :key="option.val"
                        :value="option.value"
                        :label="option.label"
                      />
                    </el-select>
                  </el-col>
                </div>
              </el-col>
              <el-col :span="12">
                <div>
                  <el-col :span="8"><b><p>Renew At:</p></b></el-col>
                  <el-col :span="15">
                    <el-input
                      disabled
                      :value="policyDetail != null ?
                        (
                          policyDetail.is_expired_at_daymonth ?
                            policyDetail.expired_policy_at_x_day + '-' + monthNumberToWords(policyDetail.expired_policy_at_x_month)
                            : (
                              policyDetail.is_expired_at_month_duration ?
                                'expired after ' + policyDetail.expired_policy_duration_month + ' month(s)' : '-'
                            )
                        ) : '-'"
                    />
                  </el-col>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <div>
                  <el-col :span="8"><b><p>Emerge after:</p></b></el-col>
                  <el-col :span="15">
                    <el-input
                      disabled
                      :value="policyDetail != null ?
                        policyDetail.emerge_after_x_month + ' months' : '-'"
                    />
                  </el-col>
                </div>
              </el-col>
              <el-col :span="12">
                <div>
                  <el-col :span="8"><b><p>Filter by Employee Status:</p></b></el-col>
                  <el-col :span="15">
                    <el-select v-model="selectedEmploymentStatus" disabled multiple>
                      <el-option
                        v-for="option in employmentStatusOption"
                        :key="option.val"
                        :value="option.value"
                        :label="option.label"
                      />
                    </el-select>
                  </el-col>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <div>
                  <el-col :span="8"><b><p>Prorate of first emerge:</p></b></el-col>
                  <el-col :span="15">
                    <el-input
                      disabled
                      :value="policyDetail != null ?
                        (policyDetail.is_prorate_first_emerge_annual_policy ? 'Yes' : 'No') : 'No'"
                    />
                  </el-col>
                </div>
              </el-col>
              <el-col :span="12">
                <div>
                  <el-col :span="8"><b><p>Effective From Join Date</p></b></el-col>
                  <el-col :span="15">
                    <el-input
                      disabled
                      :value="policyDetail != null ?
                        (policyDetail.is_effective_from_join_date ? 'Yes' : 'No') : 'No'"
                    />
                  </el-col>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <div>
                  <el-col :span="8"><b><p>Cutoff day at:</p></b></el-col>
                  <el-col :span="15">
                    <el-input
                      disabled
                      :value="policyDetail != null ?
                        policyDetail.cutoff_day_at : '-'"
                    />
                  </el-col>
                </div>
              </el-col>
            </el-row>
          </el-row>
          <Divider />
          <!-- balance gen -->
          <el-row>
            <h4>Balance Generated</h4>
            <el-table :data="policyBalanceGen" title="Balance Generated">
              <el-table-column label="Generated from">
                <template slot-scope="balgen">{{ balgen.row.balance_generated_from }}</template>
              </el-table-column>
              <el-table-column label="Generated to">
                <template slot-scope="balgen">{{ balgen.row.balance_generated_to }}</template>
              </el-table-column>
              <el-table-column label="Equal Days">
                <template slot-scope="balgen">{{ balgen.row.balance_generated_equal_days }}</template>
              </el-table-column>
            </el-table>
          </el-row>
          <br>
          <!-- Rounding -->
          <el-row>
            <h4>Rounding</h4>
            <el-table :data="policyRounding" title="Rounding">
              <el-table-column label="Day from">
                <template slot-scope="round">{{ round.row.day_from }}</template>
              </el-table-column>
              <el-table-column label="Day to">
                <template slot-scope="round">{{ round.row.day_to }}</template>
              </el-table-column>
              <el-table-column label="Rounding Type">
                <template slot-scope="round">{{ round.row.rounding_type }}</template>
              </el-table-column>
            </el-table>
          </el-row>
          <br>
        </el-tab-pane>
        <el-tab-pane style="height: 400px; overflow-y: auto;" label="Employee List">
          <el-table :data="employeeAssigned">
            <el-table-column label="Employee Id" align="center">
              <template slot-scope="empl">
                {{ empl.row.employeeId }}
              </template>
            </el-table-column>
            <el-table-column label="Name" align="center">
              <template slot-scope="empl">
                <span>{{ empl.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Status" align="center">
              <template slot-scope="empl">
                <span>{{ empl.row.employmentStatus }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Organization" align="center">
              <template slot-scope="empl">
                <span>{{ empl.row.organizationName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Title" align="center">
              <template slot-scope="empl">
                <span>{{ empl.row.positionTitle }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Grade">
              <template slot-scope="empl">
                <span>{{ empl.row.grade }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane style="height: 400px; overflow-y: auto;" label="Policy Settings">
          <el-form ref="formPolicySetting" :model="formPolicySetting">
            <div>
              <p><b>Policy Code:</b></p>
              <el-input size="small" :value="policyDetail != null ? policyDetail.policy_code : '-'" disabled />
            </div>
            <el-form-item ref="formSettingDuration" label="Timeoff Duration:">
              <el-input-number v-model="formPolicySetting.timeoff_duration" :min="0" :controls="false" size="small" />
            </el-form-item>
            <el-form-item ref="formSettingInclDayOff" label="Include day off:">
              <el-checkbox v-model="formPolicySetting.is_include_day_off" />
            </el-form-item>
            <el-form-item ref="formSettingHalfDay" label="Allow half day:">
              <el-checkbox v-model="formPolicySetting.is_allow_half_day" />
            </el-form-item>
            <el-form-item ref="formSettingDefault" label="Set default:">
              <el-checkbox v-model="formPolicySetting.is_set_default" />
            </el-form-item>
            <el-form-item ref="formSettingEmergeAtJoin" label="Emerge at Join:">
              <el-checkbox v-model="formPolicySetting.is_emerge_at_join" />
            </el-form-item>
            <el-form-item ref="formSettingShow" label="Show Policy?">
              <el-checkbox v-model="formPolicySetting.is_show" />
            </el-form-item>
            <el-form-item ref="formSettingAllowMinus" label="Allow Minus:">
              <el-checkbox v-model="formPolicySetting.is_allow_minus" />
            </el-form-item>
            <el-form-item v-if="formPolicySetting.is_allow_minus == true" ref="formSettingMinAmount" label="Minus Amount:">
              <el-input-number v-model="formPolicySetting.minus_amount" :min="0" :controls="false" size="small" />
            </el-form-item>
            <el-form-item ref="formSettingCarryFwd" label="Carry Forward:">
              <el-checkbox v-model="formPolicySetting.is_carry_forward" />
            </el-form-item>
            <el-form-item v-if="formPolicySetting.is_carry_forward == true" ref="formSettingCarryAmount" label="Carry Forward Amount:">
              <el-input-number v-model="formPolicySetting.carry_amount" :min="0" :controls="false" size="small" />
            </el-form-item>
            <el-form-item v-if="formPolicySetting.is_carry_forward == true" ref="formSettingCarryExp" label="Carry Forward Expired After (Month):">
              <el-input-number v-model="formPolicySetting.carry_expired_after_x_month" :min="0" :controls="false" size="small" />
            </el-form-item>
            <el-form-item ref="formSettingTimeoffComp" label="Timeoff compensation:">
              <el-checkbox v-model="formPolicySetting.is_timeoff_compensation" />
            </el-form-item>
            <el-form-item ref="formSettingAttchReq" label="Attachment Mandatory:">
              <el-checkbox v-model="formPolicySetting.is_attachment_required" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div>
        <el-button v-if="policyDetailTabActive === '2'" type="primary" @click="updatePolicySetting">Update</el-button>
        <el-button @click="policyDetailsVisible = false">Close</el-button>
      </div>
    </el-dialog>

    <!-- ============= modal assign emp =========== -->
    <el-dialog width="50%" style="height: 100%;" title="Assign Employee to Policy" :visible.sync="assignEmpVisible">
      <el-row style="height: 500px; overflow-y: auto;">
        <el-row>
          <el-col :span="20">
            <el-transfer
              v-model="selectedAssignedEmployee"
              :data="assignableEmployee != null ? assignableEmployee : []"
              filterable
            />
          </el-col>
          <el-col :span="4">
            <el-row><el-button type="primary" @click="assignEmployee">Assign</el-button></el-row>
            <br>
            <el-row><el-button @click="assignEmpVisible = false">Cancel</el-button></el-row>
          </el-col>
        </el-row>
        <divider />
        <el-table :data="employeeAssigned">
          <el-table-column label="Employee Id" align="center">
            <template slot-scope="empl">
              {{ empl.row.employeeId }}
            </template>
          </el-table-column>
          <el-table-column label="Name" align="center">
            <template slot-scope="empl">
              <span>{{ empl.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Status" align="center">
            <template slot-scope="empl">
              <span>{{ empl.row.employmentStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Organization" align="center">
            <template slot-scope="empl">
              <span>{{ empl.row.organizationName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Title" align="center">
            <template slot-scope="empl">
              <span>{{ empl.row.positionTitle }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Grade">
            <template slot-scope="empl">
              <span>{{ empl.row.grade }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot-scope="empl">
              <i style="cursor: pointer;" class="el-icon-delete-solid" @click="UnassignEmployee(empl.row.employeeId)" />
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-dialog>

    <!-- =========== modal add policy ============ -->
    <el-dialog width="80%" style="height: 57rem;" title="Policy Details" :visible.sync="addPolicyVisible">
      <el-row style="height: 28rem; overflow-y: auto;">
        <!-- policy details -->
        <el-row>
          <el-form ref="addPolForm" :model="formAddPolicy">
            <el-row :gutter="12">
              <el-col :span="12">
                <div>
                  <el-col :span="8"><b><p>Policy Code *:</p></b></el-col>
                  <el-col :span="15">
                    <el-form-item
                      :rules="[{ required: true, message: 'Please input policy code'}]"
                      prop="policy_code"
                    >
                      <el-input v-model="formAddPolicy.policy_code" />
                    </el-form-item>
                  </el-col>
                </div>
              </el-col>
              <el-col :span="12">
                <div>
                  <el-col :span="8"><b><p>Policy Name *:</p></b></el-col>
                  <el-col :span="15">
                    <el-form-item
                      :rules="[{ required: true, message: 'Please input policy name'}]"
                      prop="policy_name"
                    >
                      <el-input v-model="formAddPolicy.policy_name" />
                    </el-form-item>
                  </el-col>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <div>
                  <el-col :span="8"><b><p>Effective Date *:</p></b></el-col>
                  <el-col :span="15">
                    <el-form-item
                      :rules="[{ required: true, message: 'Please input policy effective date'}]"
                      prop="effectiveDate"
                    >
                      <el-date-picker v-model="formAddPolicy.effectiveDate" style="width: 100%" :value="new Date()" />
                    </el-form-item>
                  </el-col>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <div>
                  <el-col :span="5"><b><p>Policy Description:</p></b></el-col>
                  <el-col :span="19">
                    <el-input
                      v-model="formAddPolicy.policy_description"
                    />
                  </el-col>
                </div>
              </el-col>
            </el-row>
            <br>
            <el-row>
              <el-col :span="11">
                <el-radio v-model="radioNewEmpDefault" label="new_emp_default">Default for New Employee *</el-radio>
              </el-col>
              <el-col :span="12">
                <el-row>
                  <el-radio v-model="radioNewEmpDefault" label="new_emp_specific">Default for Specific New Employee *</el-radio>
                </el-row>
                <br>
                <el-row v-if="radioNewEmpDefault === 'new_emp_specific'" :gutter="2">
                  <el-col :span="8">
                    <p><b>Employee Grades *</b></p>
                    <el-select v-model="formFilter.employee_grade_id" :clearable="true" :filterable="true" multiple>
                      <el-option
                        v-for="(option,k) in employeeGradeFilter"
                        :key="k"
                        :value="option.gradeId"
                        :label="option.gradeName"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <p><b>Employee Positions *</b></p>
                    <el-select v-model="formFilter.position_id" :clearable="true" :filterable="true" multiple>
                      <el-option
                        v-for="(option,k) in employeePositionFilter"
                        :key="k"
                        :value="option.id"
                        :label="option.title"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <p><b>Employee Organizations *</b></p>
                    <el-select v-model="formFilter.organization_id" :clearable="true" :filterable="true" multiple>
                      <el-option
                        v-for="(option,k) in employeeOrganizationFilter"
                        :key="k"
                        :value="option.id"
                        :label="option.title"
                      />
                    </el-select>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <br>
            <el-row>
              <el-col :span="8">
                <div>
                  <el-checkbox
                    v-model="formAddPolicy.is_unlimited_balance"
                    label="Unlimited Balance Timeoff:"
                    style="float: none"
                  />
                </div>
              </el-col>
            </el-row>
            <divider />
            <el-row v-if="!formAddPolicy.is_unlimited_balance">
              <el-col :span="12">
                <el-row>
                  <el-row>
                    <!-- first emerge -->
                    <p><b>Policy Type *</b></p>
                    <el-select v-model="formAddPolicy.policy_type">
                      <el-option
                        v-for="option in policyTypeOptions"
                        :key="option.val"
                        :value="option.value"
                        :label="option.label"
                      />
                    </el-select>
                  </el-row>
                  <br>
                  <br>
                  <el-row>
                    <el-row>
                      <el-checkbox v-model="formAddPolicy.is_first_emerge" label="First Emerge" />
                    </el-row>
                    <br>
                    <el-row v-if="formAddPolicy.is_first_emerge" style="margin-left: 3rem; display: grid;">
                      <el-checkbox
                        v-model="formAddPolicy.is_effective_from_join_date"
                        label="Effective from join date"
                        style="margin-bottom: .75rem;"
                      />
                      <el-checkbox
                        v-if="formAddPolicy.policy_type === 'ANNUALLY'"
                        v-model="formAddPolicy.is_prorate_first_emerge_annual_policy"
                        label="Prorate on First Emerge"
                        style="margin-bottom: .75rem;"
                      />
                      <br>
                      <div style="margin-bottom: .75rem;">
                        <!-- dibuat logic juga untuk post -->
                        <el-radio v-model="radioFirstEmergeReq" label="emerge_month">Emerge After Month(s) *</el-radio>
                        <el-input-number
                          v-model="formAddPolicy.emerge_after_x_month"
                          :disabled="radioFirstEmergeReq === 'emerge_status'"
                          size="small"
                          :min="0"
                        />
                      </div>
                      <div>
                        <el-radio v-model="radioFirstEmergeReq" label="emerge_status" style="margin-bottom: .75rem;">Emerge by Employee Status *</el-radio>
                        <el-row style="display: grid; margin-left: 2rem;">
                          <el-checkbox
                            v-model="formAddPolicy.is_permanent_emp_first_emerge_status"
                            :disabled="radioFirstEmergeReq === 'emerge_month'"
                            label="Permanent Employee"
                            style="margin-bottom: .5rem;"
                          />
                          <el-checkbox
                            v-model="formAddPolicy.is_contract_emp_first_emerge_status"
                            :disabled="radioFirstEmergeReq === 'emerge_month'"
                            label="Contract Employee"
                            style="margin-bottom: .5rem;"
                          />
                          <el-checkbox
                            v-model="formAddPolicy.is_probation_emp_first_emerge_status"
                            :disabled="radioFirstEmergeReq === 'emerge_month'"
                            label="Probation Employee"
                            style="margin-bottom: .5rem;"
                          />
                        </el-row>
                      </div>
                    </el-row>
                  </el-row>
                  <br>
                  <el-row v-if="formAddPolicy.policy_type === 'ANNUALLY'">
                    <p><b>Timeoff every (day-month) *</b></p>
                    <el-col :span="8">
                      <p><b>Day *</b></p>
                      <el-input-number v-model="formAddPolicy.timeoff_at_every_day_x_annual_policy" :min="0" :controls="false" size="small" />
                    </el-col>
                    <el-col :span="16">
                      <p><b>Month *</b></p>
                      <el-select v-model="formAddPolicy.timeoff_at_every_month_x_annual_policy" size="small" filterable>
                        <el-option value="1">January</el-option>
                        <el-option value="2">February</el-option>
                        <el-option value="3">March</el-option>
                        <el-option value="4">April</el-option>
                        <el-option value="5">May</el-option>
                        <el-option value="6">June</el-option>
                        <el-option value="7">July</el-option>
                        <el-option value="8">August</el-option>
                        <el-option value="9">September</el-option>
                        <el-option value="10">October</el-option>
                        <el-option value="11">November</el-option>
                        <el-option value="12">December</el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <br>
                  <el-row>
                    <p><b>Cutoff Day At *</b></p>
                    <el-input-number v-model="formAddPolicy.cutoff_day_at" :min="0" :controls="false" size="small" />
                  </el-row>
                  <br>
                  <el-row v-if="formAddPolicy.policy_type === 'MONTHLY'">
                    <!-- logic on submit (boolean is_emerge_day_xxx) -->
                    <p><b>Emerge Day *</b></p>
                    <el-radio v-model="radioEmergeDay" label="anniversary">Anniversary</el-radio>
                    <el-radio v-model="radioEmergeDay" label="custom">Emerge day at</el-radio>
                    <el-input-number
                      v-model="formAddPolicy.custom_emerge_day_at"
                      size="small"
                      :disabled="radioEmergeDay === 'anniversary'"
                      :min="0"
                    />
                  </el-row>
                </el-row>
              </el-col>
              <el-col :span="12">
                <!-- expired -->
                <h3>Policy Expired *</h3>
                <el-row style="margin-left: 1.5rem;">
                  <!-- perlu dibuat logic untuk pemilihan expiry type -->
                  <el-row>
                    <el-radio v-model="radioPolicyExpire" label="expired_duration">
                      <p><b>Expired after duration of month(s) *</b></p>
                    </el-radio>
                    <el-row style="margin-left: 1.25rem;">
                      <el-input-number
                        v-model="formAddPolicy.expired_policy_duration_month"
                        :min="0"
                        :disabled="radioPolicyExpire !== 'expired_duration'"
                        size="small"
                      />
                    </el-row>
                  </el-row>
                  <br><br>
                  <br><br>
                  <el-row>
                    <el-radio v-model="radioPolicyExpire" label="expired_atdaymonth">
                      <p><b>Expired at day-month *</b></p>
                    </el-radio>
                    <el-row style="margin-left: 1.25rem;">
                      <el-col :span="8">
                        <p><b>Day *</b></p>
                        <el-input-number
                          v-model="formAddPolicy.expired_policy_at_x_day"
                          :min="0"
                          :disabled="radioPolicyExpire !== 'expired_atdaymonth'"
                          size="small"
                        />
                      </el-col>
                      <el-col :span="16">
                        <p><b>Month *</b></p>
                        <el-select
                          v-model="formAddPolicy.expired_policy_at_x_month"
                          :disabled="radioPolicyExpire !== 'expired_atdaymonth'"
                          size="small"
                          filterable
                        >
                          <el-option value="1">January</el-option>
                          <el-option value="2">February</el-option>
                          <el-option value="3">March</el-option>
                          <el-option value="4">April</el-option>
                          <el-option value="5">May</el-option>
                          <el-option value="6">June</el-option>
                          <el-option value="7">July</el-option>
                          <el-option value="8">August</el-option>
                          <el-option value="9">September</el-option>
                          <el-option value="10">October</el-option>
                          <el-option value="11">November</el-option>
                          <el-option value="12">December</el-option>
                        </el-select>
                      </el-col>
                    </el-row>

                  </el-row>
                  <br><br>
                  <el-row>
                    <el-radio v-model="radioPolicyExpire" label="no-expired"><p><b>No Expiry Date</b></p></el-radio>
                  </el-row>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
        <Divider />
        <el-row v-if="!formAddPolicy.is_unlimited_balance">
          <!-- balance gen -->
          <el-row>
            <h4>Balance Generated</h4>
            <!-- :data="formAddBalGen" :key="index" -->
            <table>
              <tr>
                <th>Generated From</th>
                <th />
                <th>Generated To</th>
                <th />
                <th>Equal Days</th>
                <th />
              </tr>
              <tr v-for="(val, k) in formAddBalGen" :key="k">
                <td><el-input-number v-model="val.balance_generated_from" :min="0" :controls="false" /></td>
                <th> <p> until </p> </th>
                <td><el-input-number v-model="val.balance_generated_to" :min="0" :controls="false" /></td>
                <td> <p> = </p> </td>
                <td><el-input-number v-model="val.balance_generated_equal_days" :min="0" :controls="false" /></td>
                <td>
                  <el-button v-if="formAddBalGen.length < 3" @click="addBalGenRowTable">Add Row</el-button>
                  <el-button v-if="formAddBalGen.length > 1" type="danger" @click="removeBalGenRowTable(k)">Delete Row</el-button>
                </td>
              </tr>
            </table>
          </el-row>
          <br>
          <!-- rounding -->
          <el-row>
            <h4>Rounding</h4>
            <table>
              <tr>
                <th>Day From</th>
                <th />
                <th>Day To</th>
                <th />
                <th>Rounding Type</th>
                <th />
              </tr>
              <tr v-for="(val, k) in formAddRounding" :key="k">
                <td><el-input-number v-model="val.day_from" :min="0" :controls="false" /></td>
                <td> <p> until </p> </td>
                <td><el-input-number v-model="val.day_to" :min="0" :controls="false" /></td>
                <td> <p> = </p> </td>
                <td>
                  <el-select v-model="val.rounding_type" :value="roundingPolType != null ? roundingPolType : []">
                    <el-option
                      v-for="rounding in roundingPolType"
                      :key="rounding"
                      :value="rounding"
                      :label="rounding"
                    />
                  </el-select>
                </td>
                <td>
                  <el-button v-if="formAddRounding.length < 3" @click="addRoundingRowTable">Add Row</el-button>
                  <el-button v-if="formAddRounding.length > 1" type="danger" @click="removeRoundingRowTable(k)">Delete Row</el-button>
                </td>
              </tr>
            </table>
          </el-row>
          <br>
        </el-row>
      </el-row>
      <el-row>
        <el-button type="primary" :disabled="!formValid" @click="onSubmitAddPolicy">Submit</el-button>
        <el-button @click="closeAddPolicyModal">Close</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getList, getDetail, getEmployeeInPolicy, getPolicyType,
  getAssignableEmployee, assignEmployees, unassignEmployee, updatePolSetting,
  getPolicySetting, deletePolicySingle, getRoundingType,
  savePolicy } from '@/api/policy'
import { getEmplGrade, getEmploymentStatus } from '@/api/employee'
import { getList as getListOrg } from '@/api/organization'
import { getList as getListPos } from '@/api/position'
import { Divider } from 'element-ui'
// import Item from '@/layout/components/Sidebar/Item.vue'
export default {
  // components: { Item },
  components: { Divider },
  data() {
    return {
      formValid: false,
      policiesSummary: null,
      policyDetailsVisible: false,
      assignEmpVisible: false,
      addPolicyVisible: false,
      policyDetail: null,
      policyBalanceGen: null,
      policyRounding: null,
      employeeAssigned: null,
      policyTypeOptions: null,
      selectedPolicyType: [],
      selectedEmploymentStatus: [],
      selectedAssignedEmployee: [],
      employmentStatusOption: null,
      assignableEmployee: null,
      policyCodeOnOpen: null,
      formPolicySetting: {
        'max_request_in_a_row': null,
        'minus_amount': null,
        'carry_amount': null,
        'carry_expired_after_x_month': null,
        'is_include_day_off': null,
        'is_allow_half_day': null,
        'is_set_default': null,
        'is_emerge_at_join': null,
        'is_show': null,
        'is_allow_minus': null,
        'is_carry_forward': null,
        'is_timeoff_compensation': null,
        'is_attachment_required': null,
        'timeoff_duration': null
      },
      policySettingValue: null,
      policyDetailTabActive: null,
      radioEmergeDay: null,
      radioFirstEmergeReq: null,
      radioPolicyExpire: null,
      formAddPolicy: {
        'policy_code': null,
        'policy_name': null,
        'policy_description': null,
        'effectiveDate': null,
        'policy_type': null,
        'is_new_employee_default': false,
        'is_new_employee_filtered': false,
        'is_unlimited_balance': false,
        'is_effective_from_join_date': false,
        'timeoff_at_every_day_x_annual_policy': null,
        'timeoff_at_every_month_x_annual_policy': null,
        'cutoff_day_at': null,
        'is_first_emerge': false,
        'is_prorate_first_emerge_annual_policy': false,
        'emerge_after_x_month': null,
        'is_permanent_emp_first_emerge_status': false,
        'is_contract_emp_first_emerge_status': false,
        'is_probation_emp_first_emerge_status': false,
        'emerge_day_duration_monthly_policy': null,
        'is_policy_will_expire': false,
        'is_expired_at_work_anniversary': false,
        'is_expired_at_daymonth': false,
        'is_expired_at_month_duration': false,
        'expired_policy_duration_month': null,
        'expired_policy_at_x_day': null,
        'expired_policy_at_x_month': null,
        'is_emerge_day_anniversary': false,
        'is_emerge_day_custom': false,
        'custom_emerge_day_at': null
      },
      formAddBalGen: [
        {
          'balance_generated_to': null,
          'balance_generated_from': null,
          'balance_generated_equal_days': null
        }
      ],
      formAddRounding: [
        {
          'day_from': null,
          'day_to': null,
          'rounding_type': null
        }
      ],
      roundingPolType: null,
      employeeGradeFilter: null,
      employeePositionFilter: null,
      employeeOrganizationFilter: null,
      formFilter: {
        organization_id: [],
        position_id: [],
        employee_grade_id: []
      },
      radioNewEmpDefault: null
    }
  },
  watch: {
    formAddPolicy: {
      handler() {
        this.checkForm()
      },
      deep: true
    }
  },
  created() {
    this.fetchSummary()
    this.getPolicyTypeOption()
    this.getEmploymentStatusOption()
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab.paneName, event)
      this.policyDetailTabActive = tab.paneName
    },
    checkForm() {
      this.$refs.addPolForm.validate((valid) => {
        if (valid) {
          this.formValid = true
        } else {
          this.formValid = false
        }
      })
    },
    fetchSummary() {
      getList().then((res) => {
        this.policiesSummary = res.data
      })
    },
    openModalDetails(param) {
      this.policyDetailsVisible = true
      this.policyCodeOnOpen = param
      this.getDetails(param)
      this.getEmployeeAssigned(param)
      this.getPolicySettings(param)
      console.log(param)
    },
    openModalAssignEmp(param) {
      this.assignEmpVisible = true
      this.policyCodeOnOpen = param
      this.getAssignableEmployee(param)
      this.getEmployeeAssigned(param)
    },
    getDetails(param) {
      const params = { policy_code: param }
      getDetail(params).then((res) => {
        // console.log('data:', res.data[0].policy_master)
        const data = res.data[0]
        this.policyDetail = data.policy_master
        this.policyBalanceGen = data.policy_balance_generated
        this.policyRounding = data.policy_rounding
      })
    },
    getEmployeeAssigned(param) {
      const params = { policy_code: param }
      getEmployeeInPolicy(params).then((res) => {
        this.employeeAssigned = res.data
      })
    },
    getPolicyTypeOption() {
      getPolicyType().then((res) => {
        const tmp = res.data.map(val => {
          return {
            label: val,
            value: val
          }
        })
        this.policyTypeOptions = tmp
      })
    },
    getEmploymentStatusOption() {
      getEmploymentStatus().then((res) => {
        const tmp = res.data.data.map(val => {
          return {
            label: val,
            value: val
          }
        })
        this.employmentStatusOption = tmp
      })
    },
    getAssignableEmployee(param) {
      const tmp = {
        policy_code: param
      }
      getAssignableEmployee(tmp).then((res) => {
        let tmp
        if (res.data !== []) {
          tmp = res.data.map((val) => {
            return {
              key: val.employeeId,
              label: val.employeeId + '-' + val.name + '-' + val.grade + '-' + val.positionTitle
            }
          })
        } else {
          tmp = []
        }

        this.assignableEmployee = tmp
      })
    },
    assignEmployee() {
      // console.log('emps = ', JSON.parse(JSON.stringify(this.selectedAssignedEmployee)))
      const empIds = JSON.parse(JSON.stringify(this.selectedAssignedEmployee))

      if (empIds.length > 0) {
        const param = {
          policy_code: this.policyCodeOnOpen,
          employee_ids: empIds
        }

        assignEmployees(param).then((res) => {
          this.$message({
            type: 'success',
            message: res.data
          })

          this.selectedAssignedEmployee = []
          this.getAssignableEmployee(this.policyCodeOnOpen)
          this.getEmployeeAssigned(this.policyCodeOnOpen)
        }).catch((e) => {
          this.$message({
            type: 'error',
            message: e
          })
        })
      }
    },
    UnassignEmployee(param) {
      const tmp = {
        policy_code: this.policyCodeOnOpen,
        employee_id: param
      }

      this.$confirm('This will permanently unassign the employee. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        // nanti delete ada di sini
        unassignEmployee(tmp).then((res) => {
          this.$message({
            type: 'success',
            message: 'Unassign employee' + tmp.employee_id + 'success'
          })
          this.selectedAssignedEmployee = []
          this.getAssignableEmployee(this.policyCodeOnOpen)
          this.getEmployeeAssigned(this.policyCodeOnOpen)
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: 'Unassign employee ' + tmp.employee_id + ' unsuccessful'
        })
        this.selectedAssignedEmployee = []
        this.getAssignableEmployee(this.policyCodeOnOpen)
        this.getEmployeeAssigned(this.policyCodeOnOpen)
      })
    },
    updatePolicySetting() {
      const tmp = { policy_code: this.policyCodeOnOpen }
      updatePolSetting(tmp, this.formPolicySetting).then((res) => {
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: 'update policy setting success'
          })
          this.getPolicySettings(this.policyCodeOnOpen)
          this.fetchSummary()
          this.policyDetailsVisible = false
        }
      })
    },
    getPolicySettings(param) {
      const tmp = {
        policy_code: param
      }
      getPolicySetting(tmp).then((res) => {
        this.policySettingValue = res.data

        this.formPolicySetting.max_request_in_a_row = this.policySettingValue != null ? parseInt(res.data.max_request_in_a_row) : parseInt(0)
        this.formPolicySetting.minus_amount = this.policySettingValue != null ? parseInt(res.data.minus_amount) : parseInt(0)
        this.formPolicySetting.carry_amount = this.policySettingValue != null ? parseInt(res.data.carry_amount) : parseInt(0)
        this.formPolicySetting.carry_expired_after_x_month = this.policySettingValue != null ? parseInt(res.data.carry_expired_after_x_month) : parseInt(0)
        this.formPolicySetting.is_include_day_off = this.policySettingValue != null ? res.data.is_include_day_off : false
        this.formPolicySetting.is_allow_half_day = this.policySettingValue != null ? res.data.is_allow_half_day : false
        this.formPolicySetting.is_set_default = this.policySettingValue != null ? res.data.is_set_default : false
        this.formPolicySetting.is_emerge_at_join = this.policySettingValue != null ? res.data.is_emerge_at_join : false
        this.formPolicySetting.is_show = this.policySettingValue != null ? res.data.is_show : true
        this.formPolicySetting.is_allow_minus = this.policySettingValue != null ? res.data.is_allow_minus : false
        this.formPolicySetting.is_carry_forward = this.policySettingValue != null ? res.data.is_carry_forward : false
        this.formPolicySetting.is_timeoff_compensation = this.policySettingValue != null ? res.data.is_timeoff_compensation : false
        this.formPolicySetting.is_attachment_required = this.policySettingValue != null ? res.data.is_attachment_required : false
        this.formPolicySetting.timeoff_duration = this.policySettingValue != null ? res.data.timeoff_duration : null
      })
    },
    deletePolicy(param) {
      const tmp = {
        policy_code: param
      }

      this.$confirm('This will permanently delete ' + tmp.policy_code + '. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deletePolicySingle(tmp).then((res) => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: 'Policy ' + tmp.policy_code + ' Deleted successfully'
            })
          }
          this.fetchSummary()
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: 'Delete policy ' + tmp.policy_code + ' unsuccessful'
        })
        this.fetchSummary()
      })
    },
    addPolicyModalOpen() {
      this.addPolicyVisible = true
      this.getPolRoundingType()
      this.getEmplGradeFilter()
      this.getEmplOrgFilter()
      this.getEmplPosFilter()
    },
    addBalGenRowTable() {
      this.formAddBalGen.push(
        {
          'balance_generated_to': null,
          'balance_generated_from': null,
          'balance_generated_equal_days': null
        })
    },
    removeBalGenRowTable(idxDelete) {
      this.formAddBalGen.splice(idxDelete, 1)
    },
    getPolRoundingType() {
      getRoundingType().then((res) => {
        this.roundingPolType = res.data
      })
    },
    addRoundingRowTable() {
      this.formAddRounding.push(
        {
          'day_from': null,
          'day_to': null,
          'rounding_type': null
        })
    },
    removeRoundingRowTable(idxDelete) {
      this.formAddRounding.splice(idxDelete, 1)
    },
    getEmplGradeFilter() {
      getEmplGrade().then((res) => {
        this.employeeGradeFilter = res.data.data
      })
    },
    getEmplPosFilter() {
      getListPos().then((res) => {
        const tmp = res.data.content.map((val) => {
          return {
            id: val.positionId,
            title: val.title
          }
        })
        this.employeePositionFilter = tmp
      })
    },
    getEmplOrgFilter() {
      getListOrg().then((res) => {
        const tmp = res.data.content.map((val) => {
          return {
            id: val.organizationId,
            title: val.name
          }
        })
        this.employeeOrganizationFilter = tmp
      })
    },
    resetFormAddPolicy() {
      this.formAddPolicy.policy_code = null
      this.formAddPolicy.policy_name = null
      this.formAddPolicy.policy_description = null
      this.formAddPolicy.effectiveDate = null
      this.formAddPolicy.policy_type = null
      this.formAddPolicy.is_new_employee_default = null
      this.formAddPolicy.is_new_employee_filtered = null
      this.formAddPolicy.is_unlimited_balance = null
      this.formAddPolicy.is_effective_from_join_date = null
      this.formAddPolicy.timeoff_at_every_day_x_annual_policy = null
      this.formAddPolicy.imeoff_at_every_month_x_annual_policy = null
      this.formAddPolicy.cutoff_day_at = null
      this.formAddPolicy.is_first_emerge = null
      this.formAddPolicy.is_prorate_first_emerge_annual_policy = null
      this.formAddPolicy.emerge_after_x_month = null
      this.formAddPolicy.is_permanent_emp_first_emerge_status = null
      this.formAddPolicy.is_contract_emp_first_emerge_status = null
      this.formAddPolicy.is_probation_emp_first_emerge_status = null
      this.formAddPolicy.emerge_day_duration_monthly_policy = null
      this.formAddPolicy.is_policy_will_expire = null
      this.formAddPolicy.is_expired_at_work_anniversary = null
      this.formAddPolicy.is_expired_at_daymonth = null
      this.formAddPolicy.is_expired_at_month_duration = null
      this.formAddPolicy.expired_policy_duration_month = null
      this.formAddPolicy.expired_policy_at_x_day = null
      this.formAddPolicy.expired_policy_at_x_month = null
      this.formAddPolicy.is_emerge_day_anniversary = null
      this.formAddPolicy.is_emerge_day_custom = null
      this.formAddPolicy.custom_emerge_day_at = null

      this.formFilter.organization_id = []
      this.formFilter.position_id = []
      this.formFilter.employee_grade_id = []

      this.formAddBalGen = [
        {
          'balance_generated_to': null,
          'balance_generated_from': null,
          'balance_generated_equal_days': null
        }
      ]

      this.formAddRounding = [
        {
          'day_from': null,
          'day_to': null,
          'rounding_type': null
        }
      ]
    },
    onSubmitAddPolicy() {
      if (this.radioNewEmpDefault === 'new_emp_default') {
        this.formAddPolicy.is_new_employee_default = true
        this.formAddPolicy.is_new_employee_filtered = false
      } else if (this.radioNewEmpDefault === 'new_emp_specific') {
        this.formAddPolicy.is_new_employee_default = false
        this.formAddPolicy.is_new_employee_filtered = true
      }

      if (!this.formAddPolicy.is_unlimited_balance) {
        // if (this.radioFirstEmergeReq === 'emerge_month') {
        //   this.formAddPolicy.is_permanent_emp_first_emerge_status = false
        //   this.formAddPolicy.is_contract_emp_first_emerge_status = false
        //   this.formAddPolicy.is_probation_emp_first_emerge_status = false
        // } else if (this.radioFirstEmergeReq === 'emerge_status') {
        //   this.formAddPolicy.emerge_after_x_month = null
        // }

        if (this.radioEmergeDay === 'anniversary') {
          this.formAddPolicy.is_emerge_day_anniversary = true
          this.formAddPolicy.is_emerge_day_custom = false
        } else if (this.radioEmergeDay === 'custom') {
          this.formAddPolicy.is_emerge_day_anniversary = false
          this.formAddPolicy.is_emerge_day_custom = true
        }

        if (this.radioPolicyExpire === 'expired_anniversary') {
          this.formAddPolicy.is_policy_will_expire = true
          this.formAddPolicy.is_expired_at_work_anniversary = true
          this.formAddPolicy.is_expired_at_month_duration = false
          this.formAddPolicy.is_expired_at_daymonth = false
        } else if (this.radioPolicyExpire === 'expired_duration') {
          this.formAddPolicy.is_policy_will_expire = true
          this.formAddPolicy.is_expired_at_month_duration = true
          this.formAddPolicy.is_expired_at_work_anniversary = false
          this.formAddPolicy.is_expired_at_daymonth = false
        } else if (this.radioPolicyExpire === 'expired_atdaymonth') {
          this.formAddPolicy.is_policy_will_expire = true
          this.formAddPolicy.is_expired_at_daymonth = true
          this.formAddPolicy.is_expired_at_month_duration = false
          this.formAddPolicy.is_expired_at_work_anniversary = false
        } else if (this.radioPolicyExpire === 'no-expired') {
          this.formAddPolicy.is_policy_will_expire = false
          this.formAddPolicy.is_expired_at_daymonth = false
          this.formAddPolicy.is_expired_at_month_duration = false
          this.formAddPolicy.is_expired_at_work_anniversary = false
        }
      } else {
        this.formAddPolicy.policy_type = ''
        this.formAddPolicy.is_effective_from_join_date = false
        this.formAddPolicy.timeoff_at_every_day_x_annual_policy = parseInt(0)
        this.formAddPolicy.timeoff_at_every_month_x_annual_policy = parseInt(0)
        this.formAddPolicy.cutoff_day_at = parseInt(0)
        this.formAddPolicy.is_first_emerge = false
        this.formAddPolicy.is_prorate_first_emerge_annual_policy = false
        this.formAddPolicy.emerge_after_x_month = parseInt(0)
        this.formAddPolicy.is_permanent_emp_first_emerge_status = false
        this.formAddPolicy.is_contract_emp_first_emerge_status = false
        this.formAddPolicy.is_probation_emp_first_emerge_status = false
        this.formAddPolicy.emerge_day_duration_monthly_policy = parseInt(0)
        this.formAddPolicy.is_policy_will_expire = false
        this.formAddPolicy.is_expired_at_work_anniversary = false
        this.formAddPolicy.is_expired_at_daymonth = false
        this.formAddPolicy.is_expired_at_month_duration = false
        this.formAddPolicy.expired_policy_duration_month = parseInt(0)
        this.formAddPolicy.expired_policy_at_x_day = parseInt(0)
        this.formAddPolicy.expired_policy_at_x_month = parseInt(0)
        this.formAddPolicy.is_emerge_day_anniversary = false
        this.formAddPolicy.is_emerge_day_custom = false
        this.formAddPolicy.custom_emerge_day_at = parseInt(0)
      }

      const submitFormData = {
        policy_master: JSON.parse(JSON.stringify(this.formAddPolicy)),
        balance_generated: JSON.parse(JSON.stringify(this.formAddBalGen)),
        rounding: JSON.parse(JSON.stringify(this.formAddRounding)),
        policy_filter: JSON.parse(JSON.stringify(this.formFilter))
      }

      console.log('on submit -> ', submitFormData)
      // this.resetFormAddPolicy()
      savePolicy(submitFormData).then((res) => {
        this.$message({
          type: res.status > 200 ? 'error' : 'success',
          message: res.data
        })

        this.resetFormAddPolicy()
        this.fetchSummary()
        this.addPolicyVisible = false
      })
    },
    closeAddPolicyModal() {
      this.resetFormAddPolicy()
      this.fetchSummary()
      this.addPolicyVisible = false
    },
    expiredAtTableColumnValue(policy_code) {
      const tmp = this.policiesSummary !== null
        ? this.policiesSummary.filter((val) => val.policy_code === policy_code)
        : '-'

      console.log(tmp)

      if (this.policiesSummary !== null) {
        if (tmp.is_policy_will_expire) {
          return 'Policy have no expiration date'
        } else {
          if (tmp.is_expired_at_daymonth) {
            return (tmp.expired_policy_at_x_day +
                  '-' +
                  tmp.expired_policy_at_x_month +
                  '-' + (new Date().getFullYear + 1))
          } else if (tmp.is_expired_at_month_duration) {
            return 'Expired after ' + tmp.expired_policy_duration_month + ' month(s)'
          } else if (tmp.is_expired_at_work_anniversary) {
            return 'Expired every employee\'s working anniversary'
          }
        }
      }
    },
    monthNumberToWords(monthNumber) {
      switch (monthNumber) {
        case 1:
          return 'January'
        case 2:
          return 'February'
        case 3:
          return 'March'
        case 4:
          return 'April'
        case 5:
          return 'May'
        case 6:
          return 'June'
        case 7:
          return 'July'
        case 8:
          return 'August'
        case 9:
          return 'September'
        case 10:
          return 'October'
        case 11:
          return 'November'
        case 12:
          return 'December'
        default:
          return 0
      }
    }
  }
}
</script>
    <style>
    .text {
      font-size: 14px
    }

    .item {
      margin-bottom: 18px
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }

    .box-card {
      width: 100%
    }
  </style>
