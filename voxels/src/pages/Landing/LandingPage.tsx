import {SidePanel, Viewer} from "@/components";
import {Grid} from "@mantine/core";
import {useEffect} from "react";
import { useNavigate } from "react-router";
import {useData} from "@/contexts";

export const LandingPage = () => {
    const { data } = useData()
    const navigate = useNavigate()

    useEffect(() => {
        if (!data) {
            navigate('/upload')
        }
    }, []);
    return (
        <Grid>
            <Grid.Col span={3} h={'80vh'}><SidePanel/></Grid.Col>
            <Grid.Col span={9} h={'80vh'}><Viewer/></Grid.Col>
        </Grid>
    )
}
