import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Switch, Chip, ListItem, ListItemAction, Icon } from 'react-mdl';
import Progress from './progress';
import { UPDATE_FEATURE } from '../../permissions';
import { calc, styles as commonStyles } from '../common';

import styles from './feature.scss';

const Feature = ({
    feature,
    toggleFeature,
    settings,
    metricsLastHour = { yes: 0, no: 0, isFallback: true },
    metricsLastMinute = { yes: 0, no: 0, isFallback: true },
    revive,
    hasPermission,
    hideFeatureToggle = false,
}) => {
    const { name, description, enabled, strategies } = feature;
    const { showLastHour = false } = settings;
    const isStale = showLastHour ? metricsLastHour.isFallback : metricsLastMinute.isFallback;
    const percent =
        1 *
        (showLastHour
            ? calc(metricsLastHour.yes, metricsLastHour.yes + metricsLastHour.no, 0)
            : calc(metricsLastMinute.yes, metricsLastMinute.yes + metricsLastMinute.no, 0));

    const strategiesToShow = Math.min(strategies.length, 3);
    const remainingStrategies = strategies.length - strategiesToShow;
    const strategyChips =
        strategies &&
        strategies.slice(0, strategiesToShow).map((s, i) => (
            <Chip className={styles.strategyChip} key={i}>
                {s.name}
            </Chip>
        ));
    const summaryChip = remainingStrategies > 0 && <Chip className={styles.strategyChip}>+{remainingStrategies}</Chip>;
    const featureUrl = toggleFeature === undefined ? `/archive/strategies/${name}` : `/features/strategies/${name}`;
    return (
        <ListItem twoLine>
            <span className={styles.listItemMetric}>
                <Progress strokeWidth={15} percentage={percent} isFallback={isStale} />
            </span>
            {hideFeatureToggle ? (
                <span data-test="hidden-toggle" />
            ) : (
                <span className={styles.listItemToggle}>
                    {hasPermission(UPDATE_FEATURE) ? (
                        <Switch
                            disabled={toggleFeature === undefined}
                            title={`Toggle ${name}`}
                            key="left-actions"
                            onChange={() => toggleFeature(!enabled, name)}
                            checked={enabled}
                        />
                    ) : (
                        <Switch disabled title={`Toggle ${name}`} key="left-actions" checked={enabled} />
                    )}
                </span>
            )}
            <span className={['mdl-list__item-primary-content', styles.listItemLink].join(' ')}>
                <Link to={featureUrl} className={[commonStyles.listLink, commonStyles.truncate].join(' ')}>
                    {name}
                    <span className={['mdl-list__item-sub-title', commonStyles.truncate].join(' ')}>{description}</span>
                </Link>
            </span>
            <span className={[styles.listItemStrategies, commonStyles.hideLt920].join(' ')}>
                {strategyChips}
                {summaryChip}
            </span>
            {revive && hasPermission(UPDATE_FEATURE) ? (
                <ListItemAction onClick={() => revive(feature.name)}>
                    <Icon name="undo" />
                </ListItemAction>
            ) : (
                <span />
            )}
        </ListItem>
    );
};

Feature.propTypes = {
    feature: PropTypes.object,
    toggleFeature: PropTypes.func,
    settings: PropTypes.object,
    metricsLastHour: PropTypes.object,
    metricsLastMinute: PropTypes.object,
    revive: PropTypes.func,
    hasPermission: PropTypes.func.isRequired,
    hideFeatureToggle: PropTypes.bool,
};

export default Feature;
