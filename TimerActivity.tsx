import { createLiveActivity } from 'expo-widgets';
import { Circle, HStack, Overlay, Spacer, Text, VStack, ZStack } from '@expo/ui/swift-ui';
import {
  fixedSize,
  font,
  foregroundStyle,
  frame,
  hidden,
  monospacedDigit,
  padding,
} from '@expo/ui/swift-ui/modifiers';

export type TimerProps = { title: string; startedAt: number; seconds: number };

// Each variant is the same banner (icon, title, "elapsed of total"); only the timer differs.
// Layout functions run in the widget runtime, so each one is self-contained.

// Bug: fixedSize on a timer text gives it a NaN width on iOS 27 and the whole banner is empty.
const Broken = (props: TimerProps) => {
  'widget';
  const lower = new Date(props.startedAt);
  const upper = new Date(props.startedAt + props.seconds * 1000);
  return {
    banner: (
      <HStack spacing={12} modifiers={[padding({ all: 16 })]}>
        <ZStack modifiers={[frame({ width: 44, height: 44 })]}>
          <Circle modifiers={[foregroundStyle('#E8763F')]} />
          <Text modifiers={[font({ size: 19, weight: 'semibold' })]}>1</Text>
        </ZStack>
        <VStack alignment="leading" spacing={2}>
          <Text modifiers={[font({ size: 17, weight: 'semibold' })]}>{props.title}</Text>
          <HStack spacing={0}>
            <Text
              timerInterval={{ lower, upper }}
              countsDown={false}
              modifiers={[monospacedDigit(), fixedSize({ horizontal: true, vertical: false })]}
            />
            <Text>{' of 2:00'}</Text>
          </HStack>
        </VStack>
        <Spacer />
      </HStack>
    ),
  };
};

// Without fixedSize the banner renders, but the timer takes the rest of the row,
// so " of 2:00" is pushed to the far edge.
const NoFixedSize = (props: TimerProps) => {
  'widget';
  const lower = new Date(props.startedAt);
  const upper = new Date(props.startedAt + props.seconds * 1000);
  return {
    banner: (
      <HStack spacing={12} modifiers={[padding({ all: 16 })]}>
        <ZStack modifiers={[frame({ width: 44, height: 44 })]}>
          <Circle modifiers={[foregroundStyle('#E8763F')]} />
          <Text modifiers={[font({ size: 19, weight: 'semibold' })]}>2</Text>
        </ZStack>
        <VStack alignment="leading" spacing={2}>
          <Text modifiers={[font({ size: 17, weight: 'semibold' })]}>{props.title}</Text>
          <HStack spacing={0}>
            <Text timerInterval={{ lower, upper }} countsDown={false} modifiers={[monospacedDigit()]} />
            <Text>{' of 2:00'}</Text>
          </HStack>
        </VStack>
        <Spacer />
      </HStack>
    ),
  };
};

// Proposed fix, done in JS: the timer is sized by a hidden placeholder of its longest value,
// and the live timer is drawn in an overlay. fixedSize then gets a finite width.
const Workaround = (props: TimerProps) => {
  'widget';
  const lower = new Date(props.startedAt);
  const upper = new Date(props.startedAt + props.seconds * 1000);
  return {
    banner: (
      <HStack spacing={12} modifiers={[padding({ all: 16 })]}>
        <ZStack modifiers={[frame({ width: 44, height: 44 })]}>
          <Circle modifiers={[foregroundStyle('#E8763F')]} />
          <Text modifiers={[font({ size: 19, weight: 'semibold' })]}>3</Text>
        </ZStack>
        <VStack alignment="leading" spacing={2}>
          <Text modifiers={[font({ size: 17, weight: 'semibold' })]}>{props.title}</Text>
          <HStack spacing={0}>
            <Overlay
              alignment="leading"
              modifiers={[monospacedDigit(), fixedSize({ horizontal: true, vertical: false })]}>
              <Text modifiers={[hidden()]}>0:00</Text>
              <Overlay.Content>
                <Text timerInterval={{ lower, upper }} countsDown={false} />
              </Overlay.Content>
            </Overlay>
            <Text>{' of 2:00'}</Text>
          </HStack>
        </VStack>
        <Spacer />
      </HStack>
    ),
  };
};

export const brokenActivity = createLiveActivity<TimerProps>('BrokenTimer', Broken);
export const noFixedSizeActivity = createLiveActivity<TimerProps>('NoFixedSizeTimer', NoFixedSize);
export const workaroundActivity = createLiveActivity<TimerProps>('WorkaroundTimer', Workaround);
