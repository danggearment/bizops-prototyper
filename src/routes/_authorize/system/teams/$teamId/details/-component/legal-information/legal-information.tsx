import { useQueryFinance, useQueryPod } from "@/services/connect-rpc/transport"
import { staffGetTeamLegalInformation } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import {
  userListCountry,
  userListState,
} from "@gearment/nextapi/api/pod/v1/policy-PolicyAPI_connectquery"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  InputField,
} from "@gearment/ui3"
import { useForm } from "react-hook-form"

interface Props {
  teamID: string
}

export default function LegalInformation({ teamID }: Props) {
  const { data: legalInformation } = useQueryFinance(
    staffGetTeamLegalInformation,
    { teamId: teamID },
    { select: (data) => data?.data },
  )

  const { data: listCountryOptions } = useQueryPod(userListCountry, undefined, {
    select: (data) => {
      return data.countries.map((country) => ({
        text: country.name,
        value: country.countryCode,
      }))
    },
  })

  const { data: listStateOptions } = useQueryPod(
    userListState,
    { countryCode: legalInformation?.country },
    {
      enabled: !!legalInformation?.country,
      select: (data) => {
        return data.states.map((state) => ({
          text: state.name,
          value: state.stateCode,
        }))
      },
    },
  )

  const form = useForm({
    defaultValues: {
      firstName: legalInformation?.firstName,
      lastName: legalInformation?.lastName,
      businessName: legalInformation?.businessName,
    },
  })

  const getCountryName = (code: string = "") => {
    const country = listCountryOptions?.find((c) => c.value === code)
    return country?.text || code
  }

  const getStateName = (code: string = "") => {
    const state = listStateOptions?.find((s) => s.value === code)
    return state?.text || code
  }

  if (!legalInformation) {
    return (
      <div className="bg-white rounded-lg w-full">
        <div className="p-6 text-center text-gray-500">
          No legal information available
        </div>
      </div>
    )
  }

  const renderInputField = (label: string, value: string) => (
    <FormField
      name={label}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <InputField
              {...field}
              value={value}
              readOnly
              className="w-full overflow-hidden hover:overflow-x-auto"
            />
          </FormControl>
        </FormItem>
      )}
    />
  )

  return (
    <div className="bg-background rounded-lg  w-full">
      <div className="p-4">
        <h2 className="text-xl font-semibold pb-4 mb-4 border-b">
          Legal Information
        </h2>
        <Form {...form}>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6">
              {renderInputField("First name", legalInformation?.firstName)}
            </div>
            <div className="col-span-12 md:col-span-6">
              {renderInputField("Last name", legalInformation?.lastName)}
            </div>
            <div className="col-span-12">
              {renderInputField(
                "Business name",
                legalInformation?.businessName,
              )}
            </div>
            <div className="col-span-12">
              {renderInputField("Email", legalInformation?.email)}
            </div>
            <div className="col-span-12">
              {renderInputField("Phone", legalInformation?.phone)}
            </div>
            <div className="col-span-12 md:col-span-6">
              {renderInputField(
                "Country",
                getCountryName(legalInformation?.country),
              )}
            </div>
            <div className="col-span-12 md:col-span-6">
              {renderInputField(
                "State / Province",
                getStateName(legalInformation?.state),
              )}
            </div>
            <div className="col-span-12">
              {renderInputField("Address", legalInformation?.street1)}
            </div>
            <div className="col-span-12">
              {renderInputField("Address 2", legalInformation?.street2)}
            </div>
            <div className="col-span-12 md:col-span-12">
              {renderInputField("City", legalInformation?.city)}
            </div>
            <div className="col-span-12 md:col-span-12">
              {renderInputField(
                "Zip Code / Postal code",
                legalInformation?.zipcode,
              )}
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}
