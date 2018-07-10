import PropTypes from 'prop-types'
import React, { Component } from 'react'
import moment from 'moment'

import { iterateTimes, getNextUnit } from '../utility/calendar'

export default class TimelineElementsHeader extends Component {
  static propTypes = {
    hasRightSidebar: PropTypes.bool.isRequired,
    showPeriod: PropTypes.func.isRequired,
    canvasTimeStart: PropTypes.number.isRequired,
    canvasTimeEnd: PropTypes.number.isRequired,
    canvasWidth: PropTypes.number.isRequired,
    minUnit: PropTypes.string.isRequired,
    timeSteps: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    topHeaderLabelFormats: PropTypes.object.isRequired,
    middleHeaderLabelFormats: PropTypes.object.isRequired,
    bottomHeaderLabelFormats: PropTypes.object.isRequired,
    topHeaderLabelHeight: PropTypes.number.isRequired,
    middleHeaderLabelHeight: PropTypes.number.isRequired,
    bottomHeaderLabelHeight: PropTypes.number.isRequired,
    useThreeRowHeader: PropTypes.bool.isRequired,
    registerScroll: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    props.registerScroll(scrollX => {
      if (scrollX != null) {
        this.headerEl.scrollLeft = scrollX
      }
    })
    this.state = {
      touchTarget: null,
      touchActive: false
    }
  }

  handleHeaderMouseDown(evt) {
    //dont bubble so that we prevent our scroll component
    //from knowing about it
    evt.stopPropagation()
  }

  topHeaderLabel(time, unit, width) {
    const { topHeaderLabelFormats: f } = this.props

    if (unit === 'year') {
      return time.format(width < 46 ? f.yearShort : f.yearLong)
    } else if (unit === 'month') {
      return time.format(
        width < 65
          ? f.monthShort
          : width < 75
            ? f.monthMedium
            : width < 120 ? f.monthMediumLong : f.monthLong
      )
    } else if (unit === 'week') {
      return time.format(width < 46 ? f.weekMedium : f.weekLong)
    } else if (unit === 'day') {
      return time.format(width < 150 ? f.dayShort : f.dayLong)
    } else if (unit === 'hour') {
      return time.format(
        width < 50
          ? f.hourShort
          : width < 130
            ? f.hourMedium
            : width < 150 ? f.hourMediumLong : f.hourLong
      )
    } else {
      return time.format(f.time)
    }
  }

  middleHeaderLabel(time, unit, width) {
    const { middleHeaderLabelFormats: f } = this.props

    if (unit === 'year') {
      return time.format(width < 46 ? f.yearShort : f.yearLong)
    } else if (unit === 'month') {
      return time.format(
        width < 37 ? f.monthShort : width < 85 ? f.monthMedium : f.monthLong
      )
    } else if (unit === 'week') {
      return time.format(f.weekMedium)
    } else if (unit === 'day') {
      return time.format(width < 47 ? f.dayShort : f.dayLong)
    } else if (unit === 'hour') {
      return time.format(f.hourLong);
    } else {
      return time.format(f.time)
    }
  }

  bottomHeaderLabel(time, unit, width) {
    const { bottomHeaderLabelFormats: f } = this.props

    if (unit === 'year') {
      return time.format(width < 46 ? f.yearShort : f.yearLong)
    } else if (unit === 'month') {
      return time.format(
        width < 37 ? f.monthShort : width < 85 ? f.monthMedium : f.monthLong
      )
    } else if (unit === 'week') {
      return time.format(width < 46 ? f.weekShort : f.weekMedium)
    } else if (unit === 'day') {
      return time.format(
        width < 47
          ? f.dayShort
          : width < 80 ? f.dayMedium : width < 120 ? f.dayMediumLong : f.dayLong
      )
    } else if (unit === 'hour') {
      return time.format(width < 50 ? f.hourShort : f.hourLong)
    } else if (unit === 'minute') {
      return time.format(width < 60 ? f.minuteShort : f.minuteLong)
    } else {
      return time.get(unit)
    }
  }

  handlePeriodClick = (time, unit) => {
    if (time && unit) {
      this.props.showPeriod(moment(time - 0), unit)
    }
  }

  shouldComponentUpdate(nextProps) {
    const willUpate =
      nextProps.canvasTimeStart != this.props.canvasTimeStart ||
      nextProps.canvasTimeEnd != this.props.canvasTimeEnd ||
      nextProps.width != this.props.width ||
      nextProps.canvasWidth != this.props.canvasWidth

    return willUpate
  }

  render() {
    const {
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      minUnit,
      timeSteps,
      topHeaderLabelHeight,
      middleHeaderLabelHeight,
      bottomHeaderLabelHeight,
      useThreeRowHeader,
      hasRightSidebar
    } = this.props

    const ratio = canvasWidth / (canvasTimeEnd - canvasTimeStart)
    const twoHeaders = minUnit !== 'year'
    const threeHeaders = useThreeRowHeader && minUnit !== 'month' && twoHeaders

    const topHeaderLabels = []
    // add the top header
    if (threeHeaders) {
      const nextUnit = getNextUnit(getNextUnit(minUnit))

      iterateTimes(
        canvasTimeStart,
        canvasTimeEnd,
        nextUnit,
        timeSteps,
        (time, nextTime) => {
          const left = Math.round((time.valueOf() - canvasTimeStart) * ratio)
          const right = Math.round(
            (nextTime.valueOf() - canvasTimeStart) * ratio
          )

          const labelWidth = right - left
          // this width applies to the content in the header
          // it simulates stickyness where the content is fixed in the center
          // of the label.  when the labelWidth is less than visible time range,
          // have label content fill the entire width
          const contentWidth = Math.min(labelWidth, canvasWidth / 3)

          topHeaderLabels.push(
            <div
              key={`top-label-${time.valueOf()}`}
              className={`rct-label-top${
                hasRightSidebar ? ' rct-has-right-sidebar' : ''
              }`}
              onClick={() => this.handlePeriodClick(time, nextUnit)}
              style={{
                left: `${left - 1}px`,
                width: `${labelWidth}px`,
                height: `${topHeaderLabelHeight}px`,
                lineHeight: `${topHeaderLabelHeight}px`,
                cursor: 'pointer'
              }}
            >
              <span style={{ width: contentWidth, display: 'block' }}>
                {this.topHeaderLabel(time, nextUnit, labelWidth)}
              </span>
            </div>
          )
        }
      )
    }

    const middleHeaderLabels = []
    if (twoHeaders) {
      const nextUnit = getNextUnit(minUnit)

      iterateTimes(
        canvasTimeStart,
        canvasTimeEnd,
        nextUnit,
        timeSteps,
        (time, nextTime) => {
          const left = Math.round((time.valueOf() - canvasTimeStart) * ratio)
          const right = Math.round(
            (nextTime.valueOf() - canvasTimeStart) * ratio
          )

          const labelWidth = right - left
          // this width applies to the content in the header
          // it simulates stickyness where the content is fixed in the center
          // of the label.  when the labelWidth is less than visible time range,
          // have label content fill the entire width
          const contentWidth = Math.min(labelWidth, canvasWidth / 3)

          middleHeaderLabels.push(
            <div
              key={`middle-label-${time.valueOf()}`}
              className={`rct-label-middle${
                hasRightSidebar ? ' rct-has-right-sidebar' : ''
              }`}
              onClick={() => this.handlePeriodClick(time, nextUnit)}
              style={{
                left: `${left - 1}px`,
                width: `${labelWidth}px`,
                height: `${middleHeaderLabelHeight}px`,
                lineHeight: `${middleHeaderLabelHeight}px`,
                cursor: 'pointer'
              }}
            >
              <span style={{width: contentWidth, display: 'block'}}>
                {this.middleHeaderLabel(time, nextUnit, labelWidth)}
              </span>
            </div>
          )
        }
      )
    }

    const bottomHeaderLabels = []
    iterateTimes(
      canvasTimeStart,
      canvasTimeEnd,
      minUnit,
      timeSteps,
      (time, nextTime) => {
        const left = Math.round((time.valueOf() - canvasTimeStart) * ratio)
        const minUnitValue = time.get(minUnit === 'day' ? 'date' : minUnit)
        const firstOfType = minUnitValue === (minUnit === 'day' ? 1 : 0)
        const labelWidth = Math.round(
          (nextTime.valueOf() - time.valueOf()) * ratio
        )
        const leftCorrect = firstOfType ? 1 : 0

        bottomHeaderLabels.push(
          <div
            key={`label-${time.valueOf()}`}
            className={`rct-label-bottom ${twoHeaders ? '' : 'rct-label-only'} ${
              firstOfType ? 'rct-first-of-type' : ''
            } ${minUnit !== 'month' ? `rct-day-${time.day()}` : ''} `}
            onClick={() => this.handlePeriodClick(time, minUnit)}
            style={{
              left: `${left - leftCorrect}px`,
              width: `${labelWidth}px`,
              height: `${
                threeHeaders ? bottomHeaderLabelHeight
                  : twoHeaders ? (useThreeRowHeader ? bottomHeaderLabelHeight + topHeaderLabelHeight : bottomHeaderLabelHeight)
                  :(useThreeRowHeader ? bottomHeaderLabelHeight + middleHeaderLabelHeight + topHeaderLabelHeight : bottomHeaderLabelHeight + middleHeaderLabelHeight)
              }px`,
              lineHeight: `${
                threeHeaders ? bottomHeaderLabelHeight
                  : twoHeaders ? (useThreeRowHeader ? bottomHeaderLabelHeight + topHeaderLabelHeight : bottomHeaderLabelHeight)
                  :(useThreeRowHeader ? bottomHeaderLabelHeight + middleHeaderLabelHeight + topHeaderLabelHeight : bottomHeaderLabelHeight + middleHeaderLabelHeight)
              }px`,
              fontSize: `${
                labelWidth > 30 ? '14' : labelWidth > 20 ? '12' : '10'
              }px`,
              cursor: 'pointer'
            }}
          >
            {this.bottomHeaderLabel(time, minUnit, labelWidth)}
          </div>
        )
      }
    )

    let headerStyle = {
      height: `${useThreeRowHeader ? topHeaderLabelHeight + middleHeaderLabelHeight + bottomHeaderLabelHeight : middleHeaderLabelHeight + bottomHeaderLabelHeight}px`
    }

    return (
      <div
        key="header"
        data-test-id="header"
        className="rct-header"
        onMouseDown={this.handleHeaderMouseDown}
        onTouchStart={this.touchStart}
        onTouchEnd={this.touchEnd}
        style={headerStyle}
        ref={el => (this.headerEl = el)}
      >
        <div
          className="top-header"
          style={{ height: threeHeaders ? topHeaderLabelHeight : 0, width: canvasWidth }}
        >
          {topHeaderLabels}
        </div>
        <div
          className="middle-header"
          style={{ height: twoHeaders ? middleHeaderLabelHeight : 0, width: canvasWidth}}>
          {middleHeaderLabels}
        </div>
        <div
          className="bottom-header"
          style={{
            height: threeHeaders
              ? bottomHeaderLabelHeight : twoHeaders
              ? (useThreeRowHeader ? bottomHeaderLabelHeight + topHeaderLabelHeight : bottomHeaderLabelHeight)
              : (useThreeRowHeader ? bottomHeaderLabelHeight + middleHeaderLabelHeight + topHeaderLabelHeight : bottomHeaderLabelHeight + middleHeaderLabelHeight),
            width: canvasWidth
          }}
        >
          {bottomHeaderLabels}
        </div>
      </div>
    )
  }
}
