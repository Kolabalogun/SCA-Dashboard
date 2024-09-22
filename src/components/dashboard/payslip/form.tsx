/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calender } from "@/assets/icons";

type Props = {
  form: any;
  handleChange: any;
  setForm: React.Dispatch<any>;
};

const PayslipForm = ({ form, handleChange, setForm }: Props) => {
  const {
    payslipNo,
    payslipCurrentMonth,
    employmentNo,
    gender,
    occupation,
    fullName,
    address,
    dateofappointment,
    basicSalary,
    rent_allowance,
    hazard_allowance,
    travel_allowance,
    grossEarnings,
    salary_tax,
    grossDeduction,
    pension_deduction,
    netEarnings,
    cummulative_pension,
    cummulative_tax_deduction,
    cummulative_income,
  } = form;

  return (
    <div className="space-y-9">
      <section className="space-y-6 border-b pb-10">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="flex flex-col flex-1 gap-3 w-full">
            <p className="text-sm font-medium">PaySlip Number</p>

            <Input
              onChange={handleChange}
              name="payslipNo"
              type="number"
              placeholder="0526"
              value={payslipNo}
              className="shad-input border-0 w-full"
            />
          </div>

          <div className="flex  flex-1 flex-col gap-3 w-full">
            <p className="text-sm font-medium">Payslip Current Month</p>

            <div className="flex rounded-md border border-dark-500 bg-dark-400">
              <img
                src={Calender}
                height={24}
                width={24}
                alt="user"
                className="ml-2"
              />

              <ReactDatePicker
                showTimeSelect={false}
                selected={payslipCurrentMonth}
                onChange={(date: Date | null) => {
                  setForm((prev: any) => ({
                    ...prev,
                    payslipCurrentMonth: date,
                  }));
                }}
                timeInputLabel="Time:"
                dateFormat={"dd/MM/yyyy"}
                wrapperClassName="date-picker"
              />
            </div>
          </div>

          <div className="flex  flex-1 flex-col gap-3 w-full">
            <p className="text-sm font-medium">Date of Appointment</p>

            <div className="flex rounded-md border border-dark-500 bg-dark-400">
              <img
                src={Calender}
                height={24}
                width={24}
                alt="user"
                className="ml-2"
              />

              <ReactDatePicker
                showTimeSelect={false}
                selected={dateofappointment}
                onChange={(date: Date | null) => {
                  setForm((prev: any) => ({
                    ...prev,
                    dateofappointment: date,
                  }));
                }}
                timeInputLabel="Time:"
                dateFormat={"dd/MM/yyyy"}
                wrapperClassName="date-picker"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <p className="text-sm font-medium">Full Name</p>

          <Input
            onChange={handleChange}
            name="fullName"
            placeholder="SCA/002"
            value={fullName}
            className="shad-input border-0 w-full"
          />
        </div>
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium">Occupation</p>

            <Input
              onChange={handleChange}
              name="occupation"
              placeholder="Social Worker"
              value={occupation}
              className="shad-input border-0 w-full"
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium">Gender</p>

            <Input
              onChange={handleChange}
              name="gender"
              placeholder="Male or Female"
              value={gender}
              className="shad-input border-0 w-full"
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium">Employment Number</p>

            <Input
              onChange={handleChange}
              name="employmentNo"
              placeholder="SCA/002"
              value={employmentNo}
              className="shad-input border-0 w-full"
            />
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-3">
          <div
            style={{ flex: 2 }}
            className="flex flex-col gap-3 flex-1 w-full"
          >
            <p className="text-sm font-medium">Address</p>

            <Input
              onChange={handleChange}
              name="address"
              placeholder="33, Helena Balogun St., Okeriya, Ikorodu, Lagos State"
              value={address}
              className="shad-input border-0 w-full"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6 border-b pb-10">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium">Basic Salary</p>

            <Input
              onChange={handleChange}
              name="basicSalary"
              type="number"
              placeholder="Enter Basic Salary"
              value={basicSalary}
              className="shad-input border-0 w-full"
            />
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-3">
          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium">Rent Allowance</p>

            <Input
              onChange={handleChange}
              name="rent_allowance"
              type="number"
              placeholder="Enter Rent allowance"
              value={rent_allowance}
              className="shad-input border-0 w-full"
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium">Hazard allowance</p>

            <Input
              onChange={handleChange}
              name="hazard_allowance"
              type="number"
              placeholder="Enter Hazard allowance"
              value={hazard_allowance}
              className="shad-input border-0 w-full"
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium">Travel allowance</p>

            <Input
              onChange={handleChange}
              name="travel_allowance"
              type="number"
              placeholder="Enter Travel allowance"
              value={travel_allowance}
              className="shad-input border-0 w-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <p className="text-sm font-medium">Total Gross Earnings</p>

          <Input
            onChange={handleChange}
            name="grossEarnings"
            placeholder="Total Gross Earnings"
            readOnly
            value={grossEarnings}
            className="shad-input border-0 w-full"
          />
        </div>
      </section>

      <section className="space-y-6 border-b pb-10">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium">Salary Tax</p>

            <Input
              onChange={handleChange}
              name="salary_tax"
              type="number"
              readOnly
              placeholder="Enter Salary Tex"
              value={salary_tax}
              className="shad-input border-0 w-full"
            />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium">Pension Deduction</p>

            <Input
              onChange={handleChange}
              name="pension_deduction"
              type="number"
              readOnly
              placeholder="Enter Pension Deduction"
              value={pension_deduction}
              className="shad-input border-0 w-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <p className="text-sm font-medium">Total Gross Deduction</p>

          <Input
            onChange={handleChange}
            name="grossDeduction"
            placeholder="Total Gross Deduction"
            readOnly
            value={grossDeduction}
            className="shad-input border-0 w-full"
          />
        </div>
      </section>
      <section className="space-y-6 border-b pb-10">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium">Total Gross Earnings</p>

            <Input
              onChange={handleChange}
              name="grossEarnings"
              placeholder="Total Gross Earnings"
              readOnly
              value={grossEarnings}
              className="shad-input border-0 w-full"
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium">Total Gross Deduction</p>

            <Input
              onChange={handleChange}
              name="grossDeduction"
              placeholder="Total Gross Deduction"
              readOnly
              value={grossDeduction}
              className="shad-input border-0 w-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <p className="text-sm font-medium">Total Net Earnings</p>

          <Input
            onChange={handleChange}
            name="netEarnings"
            placeholder="Total Net Earnings"
            readOnly
            value={netEarnings}
            className="shad-input border-0 w-full"
          />
        </div>
      </section>
      <section className="space-y-6 border-b pb-10">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium">Cummulative Income</p>

            <Input
              onChange={handleChange}
              name="cummulative_income"
              placeholder="Cummulative Income"
              readOnly
              value={cummulative_income}
              className="shad-input border-0 w-full"
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium">Cummulative Tax Deduction</p>

            <Input
              onChange={handleChange}
              name="cummulative_tax_deduction"
              placeholder="Cummulative Tax Deduction"
              readOnly
              value={cummulative_tax_deduction}
              className="shad-input border-0 w-full"
            />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium">Cummulative Pension</p>

            <Input
              onChange={handleChange}
              name="cummulative_pension"
              placeholder="Cummulative Pension"
              readOnly
              value={cummulative_pension}
              className="shad-input border-0 w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PayslipForm;
