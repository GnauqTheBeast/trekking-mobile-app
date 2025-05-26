import React, { useState, useCallback, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ReturnButton from "../../../components/common/ReturnButton";
import { StatusBar, View, Text, FlatList, ActivityIndicator } from "react-native";
import styles from "./styles";
import TrekInHome from "../../../components/common/TrekInHome";
import { TrekHostProps, TrekProps } from "../../../types/trek";
import { trekService } from "../../../services/trek.service";
import axios from "axios";

const PAGE_SIZE = 5; // Match backend default

const AllTrekScreen: React.FC = () => {
    const [treks, setTreks] = useState<TrekHostProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const onEndReachedCalledDuringMomentum = useRef<boolean>(true);
    const [isEndReached, setIsEndReached] = useState(false);

    const fetchTreks = useCallback(async (pageNumber: number) => {
        if (!hasMore || loading) return;

        setLoading(true);
        setError(null);
        try {
            const response = await trekService.getTreks(pageNumber, PAGE_SIZE);

            if (!response || !response.data || !response.data.data) {
                console.log('Invalid data structure:', response);
                throw new Error('Invalid response format');
            }

            const { tours, hasNext } = response.data.data;
            console.log('Tours data:', tours);

            const hostPromises = tours.map((tour: any) =>
                axios.get(`http://10.0.2.2:3002/user/getHost/${tour.host_id}`)
                    .then(res => res.data)
                    .catch(err => {
                        console.error(`Error fetching host for ${tour.host_id}:`, err);
                        return null;
                    })
            );

            const hosts = await Promise.all(hostPromises);

            const transformedTreks = tours.map((tour: any, index: number) =>
            {
                const hostInfo = hosts[index];
                return {
                    id: tour.id,
                    name: tour.name,
                    location: tour.location,
                    duration: tour.duration,
                    rate: parseFloat(tour.rate),
                    price: tour.price,
                    distance: tour.distance,
                    elevation: tour.elevation,
                    level: tour.level,
                    description: tour.description,
                    host: {
                        id: hostInfo?.id || '',
                        name: hostInfo?.name || 'Unknown Host',
                        image: hostInfo?.image || ''
                    },
                    status: tour.status,
                    booked: tour.slot - tour.available_slot,
                    images: JSON.parse(tour.images),
                    startAt: tour.start_at,
                    endAt: tour.end_at,
                    total_slot: tour.slot,
                    available_slot: tour.available_slot,
                    created_at: new Date(tour.created_at),
                    updated_at: new Date(tour.updated_at)
                }
            });

            setHasMore(hasNext);
            setTreks(prev => pageNumber === 1 ? transformedTreks : [...prev, ...transformedTreks]);
            setPage(pageNumber);
            setIsEndReached(false);
        } catch (error) {
            console.error('Error fetching treks:', error);
            setError('Failed to load treks. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLoadMore = () => {
        if (!loading && hasMore && !onEndReachedCalledDuringMomentum.current && isEndReached) {
            onEndReachedCalledDuringMomentum.current = true;
            fetchTreks(page + 1);
        }
    };

    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 20;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;

        if (isCloseToBottom) {
            setIsEndReached(true);
        }
    };

    const renderFooter = () => {
        if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            );
        }
        if (!loading) return null;
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#FF8E4F" />
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No treks available</Text>
            </View>
        );
    };

    React.useEffect(() => {
        let mounted = true;

        const initializeTreks = async () => {
            if (mounted) {
                await fetchTreks(1);
            }
        };

        initializeTreks();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <ReturnButton />
                <Text style={styles.headerTitle}>Explore Treks</Text>
            </View>
            <View style={styles.content}>

                <FlatList
                    data={treks}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 80,
                        flexGrow: 1,
                        gap: 16
                    }}
                    style={styles.listContainer}
                    renderItem={({ item }) => (
                        <TrekInHome {...item} />
                    )}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.3}
                    onScroll={handleScroll}
                    onMomentumScrollBegin={() => {
                        onEndReachedCalledDuringMomentum.current = false;
                    }}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                />
            </View>
        </SafeAreaView>
    );
};

export default AllTrekScreen;