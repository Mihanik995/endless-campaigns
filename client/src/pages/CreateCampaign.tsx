import Header from "../components/Header.tsx";
import {Box, Button, Card, Container, Flex, Grid, Heading, IconButton, Separator, Spinner} from "@radix-ui/themes";
import {useState} from "react";
import TextInput from "../components/TextInput.tsx";
import TextAreaInput from "../components/TextAreaInput.tsx";
import axios from "../axios/axiosConfig.ts";
import {useNavigate} from "react-router";
import CheckInput from "../components/CheckInput.tsx";
import ErrorHandler from "../components/ErrorHandler.tsx";
import type {CampaignCreate} from "../types.ts";
import {type SubmitHandler, useForm} from "react-hook-form";
import {Cross2Icon} from "@radix-ui/react-icons";

export default function () {
    const {control, handleSubmit, watch, getValues, setValue} = useForm<CampaignCreate>({
        defaultValues: {
            requiresPairingReport: false,
            requiresPairingResultsApproval: false,
            requiresRegisterApproval: false,
            usesAssets: false,
            assetGroups: []
        },
        mode: "onBlur"
    })
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error>()
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<CampaignCreate> = function (data) {
        setIsLoading(true);
        axios.post('/campaigns', data)
            .then(res => {
                if (res.status === 201) navigate('/dashboard')
            })
            .catch((error) => setError(error as Error))
            .finally(() => setIsLoading(false))
    }

    return (
        <>
            <Header/>
            <Container maxWidth="700px" className="pb-5 pt-23">
                <Card size="2">
                    {isLoading
                        ? <Spinner size="3"/>
                        : <Flex align="center" justify="center">
                            <Flex maxWidth="700px" direction="column" gap="2">
                                <Heading>Essentials</Heading>
                                <Flex direction="column" gap="3">
                                    <TextInput
                                        label="Title"
                                        name="title"
                                        control={control}
                                    />
                                    <TextAreaInput
                                        label="Description"
                                        name="description"
                                        control={control}
                                    />
                                    <Flex gap="5">
                                        <Flex direction="column" align="end" gap="3">
                                            <TextInput
                                                label="Date Start"
                                                name="dateStart"
                                                type="date"
                                                control={control}
                                            />
                                            <TextInput
                                                label="End Date"
                                                name="dateEnd"
                                                type="date"
                                                control={control}
                                            />
                                        </Flex>
                                        <Container>
                                            <Flex direction="column" gap="6">
                                                <TextInput
                                                    label="Regulations link"
                                                    name="regulations"
                                                    control={control}
                                                />
                                                <CheckInput
                                                    name="requiresRegisterApproval"
                                                    label="Player register requires master approval"
                                                    control={control}
                                                />
                                            </Flex>
                                        </Container>
                                    </Flex>
                                </Flex>
                                <Separator size="4"/>
                                <Heading>Pairings</Heading>
                                <Grid my="2" columns={{
                                    initial: '1',
                                    xs: '2'
                                }} gap="3" width="auto">
                                    <CheckInput
                                        name="requiresPairingResultsApproval"
                                        label="Pairings results should be approved by campaign master"
                                        control={control}
                                    />
                                    <CheckInput
                                        name="requiresPairingReport"
                                        disabled={!watch('requiresPairingResultsApproval')}
                                        label="Players should attach the link to the pairing report"
                                        control={control}
                                    />
                                </Grid>
                                <Separator size="4"/>
                                <Heading>Assets</Heading>
                                <Box my="2">
                                    <CheckInput
                                        label="Campaign uses assets"
                                        name="usesAssets"
                                        control={control}
                                    />
                                </Box>
                                {watch('usesAssets') &&
                                  <Grid columns={{
                                      initial: '1',
                                      xs: '2',
                                      sm: '3'
                                  }} gap="2" align="center">
                                      {watch('assetGroups').map((group, index) =>
                                          <Flex gap="2" align="center">
                                              <TextInput
                                                  control={control}
                                                  name={`assetGroups.${index}.groupTitle`}
                                                  placeholder="Group title"
                                              />
                                              <IconButton
                                                  onClick={() => setValue(
                                                      'assetGroups',
                                                      getValues('assetGroups').filter(g => g !== group)
                                                  )}
                                                  color="red"
                                                  radius="full"
                                              >
                                                  <Cross2Icon/>
                                              </IconButton>
                                          </Flex>)
                                      }
                                    <Button
                                      onClick={() => setValue(
                                          'assetGroups',
                                          [...getValues('assetGroups'), {groupTitle: ''}]
                                      )}
                                    >
                                      Add Asset Group
                                    </Button>
                                  </Grid>
                                }
                                <Separator size="4"/>
                                <Button onClick={handleSubmit(onSubmit)}>
                                    Create
                                </Button>
                            </Flex>
                        </Flex>
                    }
                    {!!error && <ErrorHandler error={error}/>}
                </Card>
            </Container>
        </>
    )
}